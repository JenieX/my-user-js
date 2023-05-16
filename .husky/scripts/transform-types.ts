import fsp from 'node:fs/promises';

const commitMessageFilePath = process.argv[2]!;

const emojiMap: Record<string, string> = {
  'build:': '👷',
  'chore:': '🧹',
  'ci:': '🤖',
  'docs:': '📝',
  'feat:': '✨',
  'fix:': '🐛',
  'perf:': '⚡️',
  'refactor:': '🛠️',
  'revert:': '⏪️',
  'style:': '🎨',
  'test:': '🧪',
};

const commitMessage = await fsp.readFile(commitMessageFilePath, 'utf-8');
const [type] = commitMessage.match(/^[^:]+:/)!;

const isInitialCommit = commitMessage.includes(': Begin the project');
const isVersionCommit = commitMessage.includes(': Update version');

const typeEmoji = isInitialCommit ? '🎉' : (isVersionCommit ? '✅' : emojiMap[type]!);
const updatedCommitMessage = commitMessage.replace(type, typeEmoji);

await fsp.writeFile(commitMessageFilePath, updatedCommitMessage);

// process.exit(1);

// git commit --message="feat: Begin the project"

/**
 * 1. build: 👷
 * • Build new Docker container for deployment
 * • Update build process to include new dependencies
 * • Create new build script for easier deployment
 * • Introduce new build tools for better performance
 * • Refactor build process to improve efficiency
 *
 * 2. chore: 🧹
 * • Clean up code formatting for better readability
 * • Update dependencies to latest version
 * • Remove unused files and code
 * • Refactor code to improve performance
 * • Create new branch for upcoming feature development
 *
 * 3. ci: 🤖
 * • Configure new CI/CD pipeline for better automation
 * • Integrate new testing tools into CI process
 * • Add new deployment steps to CI pipeline
 * • Improve error handling in CI pipeline
 * • Refactor CI/CD process to improve efficiency
 *
 * 4. docs: 📝
 * • Update README file with installation instructions
 * • Create new user guide for app usage
 * • Document code changes in release notes
 * • Update API documentation with new endpoints
 * • Write new technical documentation for new features
 *
 * 5. feat: ✨
 * • Add new feature to allow users to upload profile pictures
 * • Implement search functionality for the app
 * • Create new dashboard for displaying user analytics
 * • Integrate payment gateway for processing transactions
 * • Implement push notifications for new messages
 *
 * 6. fix: 🐛
 * • Fix bug causing app to crash on startup
 * • Resolve issue with incorrect login credentials
 * • Fix broken link on homepage
 * • Correct spelling errors in user interface
 * • Address security vulnerability in authentication process
 *
 * 7. perf: ⚡️
 * • Improve app loading times for better user experience
 * • Optimize database queries for better performance
 * • Introduce new features for better performance
 * • Implement new algorithms for better efficiency
 * • Introduce new architecture for better scalability
 *
 * 8. refactor: 🛠️
 * • Refactor code to improve maintainability
 * • Reorganize code structure for better readability
 * • Introduce automation for better efficiency
 * • Refactor code to reduce technical debt
 * • Refactor code to improve code quality
 *
 * 9. revert: ⏪️
 * • Revert recent code changes to previous state
 * • Undo recent database changes to previous state
 * • Roll back recent deployment to previous version
 * • Revert merge of feature branch to main branch
 * • Undo recent commit for bug fix
 *
 * 10. style: 🎨
 * • Improve layout of login page for better user experience
 * • Update color scheme to match company branding
 * • Adjust font sizes for better readability
 * • Add animations to user interface for more engaging experience
 * • Apply consistent styling across entire app
 *
 * 11. test: 🧪
 * • Write new unit tests for code coverage
 * • Implement new integration tests for better testing
 * • Add new load tests for better performance testing
 * • Test app for vulnerabilities
 * • Conduct user acceptance testing for better feedback
 */
