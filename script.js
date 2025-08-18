import { marked } from 'marked';

const MOCK_PROJECTS = {
  "12345": {
    id: "12345",
    slug: "my-awesome-project",
    name: "My Awesome Project",
    versions: [
      {
        versionId: "v1",
        createdAt: "2023-10-26T10:00:00Z",
        prompt: "Create an amazing interactive web page with a blue button.",
        model: "gpt-4"
      },
      {
        versionId: "v2",
        createdAt: "2023-10-26T11:30:00Z",
        prompt: "Add a cool animation to the button.",
        model: "claude-2"
      },
      {
        versionId: "v3",
        createdAt: "2023-10-27T09:15:00Z",
        prompt: "Make it responsive and add a dark mode.",
        model: "gpt-4-turbo"
      }
    ]
  },
  "67890": {
    id: "67890",
    slug: "data-visualization-tool",
    name: "Data Visualization Tool",
    versions: [
      {
        versionId: "v1",
        createdAt: "2024-01-10T14:00:00Z",
        prompt: "Create a bar chart component using D3.js. The chart should display mock sales data for the last 7 days.",
        model: "gemini-pro"
      },
      {
        versionId: "v2",
        createdAt: "2024-01-11T16:20:00Z",
        prompt: "Add tooltips to the bar chart that appear on hover, showing the exact sales number.",
        model: "gemini-pro"
      },
      {
        versionId: "v3",
        createdAt: "2024-01-12T11:00:00Z",
        prompt: "Refactor the D3 code to be more modular. Create separate functions for setting up the SVG, drawing axes, and drawing the bars.",
        model: "gpt-4-turbo"
      },
      {
        versionId: "v4",
        createdAt: "2024-01-13T18:45:00Z",
        prompt: "Add a feature to switch between a bar chart and a line chart to visualize the same data.",
        model: "claude-3-opus"
      }
    ]
  }
};

const MOCK_PROJECTS_BY_SLUG = {
  "my-awesome-project": MOCK_PROJECTS["12345"],
  "data-visualization-tool": MOCK_PROJECTS["67890"]
};

const form = document.getElementById('project-form');
const input = document.getElementById('project-input');
const loader = document.getElementById('loader');
const projectInfoContainer = document.getElementById('project-info');
const errorMessageContainer = document.getElementById('error-message');

form.addEventListener('submit', handleSearch);

async function handleSearch(event) {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Reset UI
    projectInfoContainer.innerHTML = '';
    errorMessageContainer.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const project = await fetchProjectData(query);
        renderProject(project);
    } catch (error) {
        showError(error.message);
    } finally {
        loader.classList.add('hidden');
    }
}

function fetchProjectData(identifier) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = MOCK_PROJECTS[identifier] || MOCK_PROJECTS_BY_SLUG[identifier];
            if (project) {
                resolve(project);
            } else {
                reject(new Error(`Project with identifier "${identifier}" not found.`));
            }
        }, 1000); // Simulate network delay
    });
}

function renderProject(project) {
    const projectHeader = document.createElement('h2');
    projectHeader.textContent = project.name;

    const versionList = document.createElement('ul');
    versionList.className = 'version-list';

    // Display versions from newest to oldest
    project.versions.slice().reverse().forEach(version => {
        const versionItem = document.createElement('li');
        versionItem.className = 'version-item';

        const promptHtml = marked.parse(version.prompt);
        
        versionItem.innerHTML = `
            <div class="version-header">
                <span class="version-id">Version: ${version.versionId}</span>
                <span class="model-tag">${version.model}</span>
            </div>
            <div class="prompt">${promptHtml}</div>
        `;
        versionList.appendChild(versionItem);
    });

    projectInfoContainer.appendChild(projectHeader);
    projectInfoContainer.appendChild(versionList);
}

function showError(message) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.classList.remove('hidden');
}

