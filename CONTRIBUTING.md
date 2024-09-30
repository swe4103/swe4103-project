# Contributing

When making changes in this project, whether new features or bug fixes, the workflow should resemble the following.

**Note:** If you use a UI tool for git like GitHub Desktop, feel free to keep using it and loosely follow the below steps.

1. Checkout the main branch

```bash
git checkout main
```

2. Pull the latest changest from the main branch

```bash
git pull origin main
```

3. Create your new branch that you will work on. Use `feat` for a new feature, or `fix` for a bug fix. `SCRUM-#` should correspond with the Jira ticket number you are working off of.

```bash
git checkout -b feat|fix-SCRUM-#
```

4. After you are satisfied with your changes, add the changes to your local staging area

```bash
git add <files-to-add>
```

5. Commit your changes with a short, informative commit message. Please prefix it with `feat` or `fix` like your branch name, and your Jira identifier in brackets

```bash
git commit -m "feat|fix(SCRUM-#): Example message"
```

6. Finally, push your changes to your remote branch

```bash
git push origin <branch-name>
```

A full example is shown below for clarity:

```bash
git checkout main
git pull origin main
git checkout -b feat-SCRUM-1

... make changes ...

git add newfile.txt
git commit -m "feat(SCRUM-1): Add new text file"
git push origin feat-SCRUM-1
```

7. After you do this, you should be able to go to our repository on GitHub, and create a new Pull Request that can be reviewed by other team members and eventually merged into the main branch

8. Once you have created the Pull Request, you will notice a template is present in the description field. Please fill out this template so team members can review your PR with ease.

### 🚨 Important Note!

Please never push code directly to the main branch, this is against our rules and is bad practice. Always create a branch and create a pull request in order to get your code merged into main. If you are confused after the explanation above, please reach out to Matthew Collett or Eric Cuenat, we'd be more than happy to explain in more detail.
