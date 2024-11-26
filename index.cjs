module.exports = (app) => {
  app.on('pull_request.labeled', async (context) => {
    const labelName = 'Update snapshots';

    // Get the label added to the PR
    const label = context.payload.label.name;

    // Check if the added label matches
    if (label === labelName) {
      const { owner, repo } = context.repo();
      const prNumber = context.payload.pull_request.number;
      const branch = context.payload.pull_request.head.ref;

      // Log the activity
      context.log(`Label "${labelName}" detected on PR #${prNumber}`);

      // Perform the snapshot update
      try {
        // Update snapshots logic (example: commit new snapshot files)
        const filePath = '__snapshots__/example.test.js.snap'; // Example file
        const fileContent = `Updated snapshot content for ${new Date()}`; // Replace with real update logic
        const base64Content = Buffer.from(fileContent).toString('base64');

        // Push changes to the PR branch
        const { data: { sha } } = await context.octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch,
        });

        await context.octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: filePath,
          message: 'Update snapshots',
          content: base64Content,
          branch,
          sha,
        });

        context.log(`Snapshots updated successfully for PR #${prNumber}`);
      } catch (error) {
        context.log.error(`Failed to update snapshots for PR #${prNumber}:`, error);
      }
    }
  });
};
