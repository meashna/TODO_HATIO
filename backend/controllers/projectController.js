// controllers/projectController.js
const Project = require('../models/Project');
const Todo = require('../models/Todo');
const { createGist } = require('../services/githubService');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

/**
 * Helper function to authenticate user using Basic Auth
 */
const authenticate = async (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const user = await User.findOne({ username });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title } = req.body;

        const project = new Project({ title, user: user._id });
        await project.save();

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all projects for the authenticated user
exports.getAllProjects = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const projects = await Project.find({ user: user._id }).populate('todos');
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const project = await Project.findOne({ _id: req.params.id, user: user._id }).populate('todos');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// exports.updateProjectTitle = async (req, res) => {
//     try {
//         const { title } = req.body;
//         const user = req.user; // Retrieved from auth middleware

//         const project = await Project.findOneAndUpdate(
//             { _id: req.params.id, user: user._id },
//             { title },
//             { new: true }
//         ).populate('todos'); // Populate the todos

//         if (!project) return res.status(404).json({ message: 'Project not found' });

//         res.status(200).json(project);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
exports.updateProjectTitle = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        // Check if Authorization header is present
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Decode Basic Auth credentials
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Proceed to update the project title
        const { title } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, user: user._id },
            { title },
            { new: true }
        ).populate('todos');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const project = await Project.findOneAndDelete({ _id: req.params.id, user: user._id });

        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Optionally, delete all associated todos
        await Todo.deleteMany({ _id: { $in: project.todos } });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export Project Summary as Gist
// exports.exportProjectSummary = async (req, res) => {
//     try {
//         const user = await authenticate(req);
//         if (!user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const projectId = req.params.id;

//         const project = await Project.findOne({ _id: projectId, user: user._id }).populate('todos');
//         if (!project) return res.status(404).json({ message: 'Project not found' });

//         const totalTodos = project.todos.length;
//         const completedTodos = project.todos.filter(todo => todo.status === 'Completed').length;
//         const pendingTodos = project.todos.filter(todo => todo.status === 'Pending');

//         // Generate Markdown Content
//         let markdown = `# ${project.title}\n\n`;
//         markdown += `**Summary:** ${completedTodos} / ${totalTodos} completed.\n\n`;

//         markdown += `## Pending\n`;
//         pendingTodos.forEach(todo => {
//             markdown += `- [ ] ${todo.description} (Created: ${new Date(todo.createdDate).toDateString()})\n`;
//         });

//         markdown += `\n## Completed \n`;
//         project.todos
//             .filter(todo => todo.status === 'Completed')
//             .forEach(todo => {
//                 markdown += `- [x] ${todo.description} (Completed: ${new Date(todo.updatedDate).toDateString()})\n`;
//             });

//         // Save Markdown Locally
//         const fileName = `${project.title.replace(/\s+/g, '_')}.md`;
//         const filePath = path.join(__dirname, '..', 'exports', fileName);

//         // Ensure exports directory exists
//         fs.mkdirSync(path.dirname(filePath), { recursive: true });
//         fs.writeFileSync(filePath, markdown);

//         // Create Secret Gist
//         const gist = await createGist(
//             `Project Summary: ${project.title}`,
//             {
//                 [fileName]: {
//                     content: markdown,
//                 },
//             },
//             false // false for secret gist
//         );

//         res.status(200).json({ message: 'Gist created successfully', gistUrl: gist.html_url });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Export Project Summary as Gist or PDF Based on Environment
// Export Project Summary as Gist or Local File Based on Environment
exports.exportProjectSummary = async (req, res) => {
    try {
        const user = await authenticate(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const projectId = req.params.id;

        const project = await Project.findOne({ _id: projectId, user: user._id }).populate('todos');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const totalTodos = project.todos.length;
        const completedTodos = project.todos.filter(todo => todo.status === 'Completed').length;
        const pendingTodos = project.todos.filter(todo => todo.status === 'Pending');

        // Generate Markdown Content
        let markdown = `# ${project.title}\n\n`;
        markdown += `**Summary:** ${completedTodos} / ${totalTodos} completed.\n\n`;

        markdown += `## Pending\n`;
        pendingTodos.forEach(todo => {
            markdown += `- [ ] ${todo.description} (Created: ${new Date(todo.createdDate).toDateString()})\n`;
        });

        markdown += `\n## Completed \n`;
        project.todos
            .filter(todo => todo.status === 'Completed')
            .forEach(todo => {
                markdown += `- [x] ${todo.description} (Completed: ${new Date(todo.updatedDate).toDateString()})\n`;
            });

        const fileName = `${project.title.replace(/\s+/g, '_')}.md`;

        if (process.env.NODE_ENV !== 'production') {
            // **Development Environment: Save Markdown to Local File**
            const filePath = path.join(__dirname, '..', 'exports', fileName);

            try {
                // Ensure exports directory exists
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                // Write Markdown to file
                fs.writeFileSync(filePath, markdown, 'utf8');
                console.log(`Exported project "${project.title}" to local file: ${filePath}`);
            } catch (fileErr) {
                console.error('Failed to write Markdown file locally:', fileErr);
                // Optionally, you can decide to return an error or proceed to create the Gist
                // Here, we'll proceed to create the Gist even if file writing fails
            }
        }

        // **Create Secret Gist in Both Environments**
        const gist = await createGist(
            `Project Summary: ${project.title}`,
            {
                [fileName]: {
                    content: markdown,
                },
            },
            false // false for secret gist
        );

        // **Respond with Gist URL**
        res.status(200).json({ message: 'Gist created successfully', gistUrl: gist.html_url });
    } catch (err) {
        console.error('Error exporting project summary:', err);
        res.status(500).json({ error: err.message });
    }
};