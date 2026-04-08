# Boards Blueprint

Static study planner app built from `BOARD PREP CALENDAR.xlsx`.

## Open it

Open [index.html](/Users/wolfs/Documents/board-prep-app/index.html) in a browser.

## What it includes

- Your April to June 2026 board schedule from the spreadsheet
- Calendar filtering by day type
- Daily command center for logging completion, question counts, scores, weak topics, and notes
- Practice exam tracker
- Catch-up cards for unfinished work
- CSV schedule import with column mapping so other people can use their own calendar format
- JSON backup export/import for restoring planner data
- Local persistence in browser storage

## Share it with other people

The app can now be shared as code. A friend can open [index.html](/Users/wolfs/Documents/board-prep-app/index.html), scroll to the bottom, and use `Import Schedule` to bring in their own CSV calendar.

Required mapped columns:

- `Date`
- `System`
- `Type`
- `Content Focus`

Optional mapped columns:

- `Qbank Plan`
- `Obligations`
- `Notes`
- `Phase`
- `Week`

The imported schedule is saved locally in that browser, and `Use Built-in Schedule` switches back to the original embedded plan.

## Publish on GitHub Pages

This app is a static site, so it can be hosted for free on GitHub Pages.

1. Create a new empty GitHub repository.
2. In Terminal, go to this folder:

```bash
cd /Users/wolfs/Documents/board-prep-app
```

3. Initialize git and push the app:

```bash
git init
git add .
git commit -m "Initial board prep app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

4. On GitHub, open the repository settings.
5. Go to `Pages`.
6. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
7. Save, then wait a minute for the site to publish.

Your live URL will usually look like:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

Each person's planner data stays in their own browser, and they can import their own CSV schedule from the app footer.

## Refresh from the Excel file

If you update the spreadsheet later, run:

```bash
ruby /Users/wolfs/Documents/board-prep-app/refresh_from_xlsx.rb "/Users/wolfs/Downloads/BOARD PREP CALENDAR.xlsx"
```
