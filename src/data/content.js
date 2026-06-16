// All content extracted from handwritten notes
export const content = {

  intro: {
    title: 'Git Intro & Version Control',
    concepts: [
      {
        term: 'Git',
        definition: 'Distributed Version Control System — powerful & versatile. Each developer has a complete copy on their local machine.',
        tag: 'core',
      },
      {
        term: 'Version Control',
        definition: 'System to record changes to files over time. Track modifications, multiple users collaborate, revert to previous states.',
        tag: 'concept',
      },
      {
        term: 'Snapshot',
        definition: 'When saving work in version control, Git creates a snapshot (commit) — entire state of project at that specific point in time.',
        tag: 'concept',
      },
    ],
    keyFeatures: [
      { icon: '🌐', title: 'Distributed Architecture', desc: 'Every user has the whole code — full history locally.' },
      { icon: '🌿', title: 'Branching & Merging', desc: 'Experiment without affecting main codebase.' },
      { icon: '📦', title: 'Staging Area', desc: 'Changes staged before committing — control what goes in each commit.' },
      { icon: '⚡', title: 'Speed & Efficiency', desc: 'Fast & quick even in large projects.' },
    ],
    objectModel: [
      { name: 'Blob', color: 'blue', desc: 'Content of each file. Stored as blob, identified by unique SHA-1 hash. Raw content — doesn\'t know filename or path.' },
      { name: 'Tree', color: 'green', desc: 'Directory structure. Contains pointers to blobs & other tree objects. Allows Git to keep track of entire hierarchy of folders/directories.' },
      { name: 'Commit', color: 'purple', desc: 'Snapshot of project at specific point. Contains metadata (msg, ptr to tree obj, ptr to parent commits). SHA-1 hash = fingerprint of snapshot.' },
      { name: 'Tag', color: 'yellow', desc: 'Marker of important commits (releases). Used for rebase. Points to specific commit object.' },
    ],
    workflows: [
      {
        name: 'Feature Branch Workflow',
        steps: ['Create new branch for new feature', 'Develop & commit to branch', 'Open Pull Request (PR) to merge feature branch into main', 'Conduct code review before merge'],
      },
      {
        name: 'Git Flow',
        steps: ['feature branches — new feature', 'develop branch — ongoing dev', 'release branch — prepare new prod release', 'hotfix branch — urgent fixes'],
      },
      {
        name: 'GitHub Flow',
        steps: ['Create branch (new feature/fix)', 'Make changes & commit', 'Push to remote repo', 'Open PR for discussion & review'],
        note: 'Simple — hosted on GitHub. For open source & smaller teams.',
      },
    ],
    dvcsVsCvcs: {
      dvcs: ['Local copies for each user', 'Full offline functionality', 'Simple branch & merging', 'Independent collaboration', 'Full history'],
      cvcs: ['Central server only', 'Limited offline', 'Complex branching', 'Real-time server dependent', 'Limited history'],
    },
    config: [
      { cmd: 'git config --global user.name "Your Name"', desc: 'Set your name globally' },
      { cmd: 'git config --global user.email "you@eg.com"', desc: 'Set your email globally' },
      { cmd: 'git config --list', desc: 'List all config settings' },
      { cmd: 'git config --global core.editor "code --wait"', desc: 'Set VS Code as editor' },
      { cmd: 'git config --global alias.co checkout', desc: 'Create alias: git co = git checkout' },
      { cmd: 'git config --global credential.helper cache', desc: 'Cache credentials for 15 mins' },
    ],
  },

  basics: {
    title: 'Git Basics',
    coreOps: [
      { cmd: 'git init', desc: 'Initializes new git repo. Creates .git directory with subfolders: config, head, desc, hooks, info, obj, refs.' },
      { cmd: 'git add .', desc: 'Stage all changes in working directory for next commit.' },
      { cmd: 'git add file.txt', desc: 'Stage a specific file alone.' },
      { cmd: 'git commit -m "msg"', desc: 'Records changes in repo history. Solidify changes in git, take snapshot of project at that moment.' },
      { cmd: 'git status', desc: 'Shows exactly what\'s going on in your working dir & staging area. Which untracked/modified & ready to commit.' },
      { cmd: 'git log', desc: 'Displays commit history, view past changes (commit msg, date, author, commits).' },
      { cmd: 'git branch', desc: 'Create, list, delete branches. Helps to work in isolation without affect main codebase.' },
      { cmd: 'git checkout', desc: 'Switch between branches and restore to specific state.' },
    ],
    stagingArea: {
      explanation: 'Middle layer between working directory & commit history. Place to prepare & review changes before committing.',
      howItWorks: [
        'git add → "these are the changes I want to include in my next commit"',
        'Creates snapshot → take current content of file',
        'Compress them → stores inside .git/objects dir as blob (binary large obj)',
        'Update staging area → for next commit, the path of file uses SHA-1 / SHA-256 hash',
        'Leaves working dir as-is → no changes locally',
        'It\'s a "draft" of next snapshot (commit)',
      ],
    },
    commitDetails: {
      whatHappens: [
        'Reads staging area',
        'Builds tree obj — matches staged files & dir layout',
        'Creates commit obj — points to tree and to its parent commits',
        'Clears "to be committed" state in index for next commit',
      ],
      flags: [
        { flag: '--amend', desc: 'When need to change most recent commit. Edit commit msg (last one) / add new changes (staged). Replace the prev commit. Used before push to avoid conflicts.' },
        { flag: '--no-edit', desc: 'Amend commit without changing its message.' },
        { flag: '--dry-run', desc: 'Before commit, see changes what included, without making commits.' },
      ],
    },
    gitignore: {
      purpose: 'Tells git what to exclude from project to be tracked. When git add executes, it checks rules of gitignore — if satisfied, it will be ignored (not staged).',
      why: ['Reduce clutter', 'Sensitive data', 'Performance improve'],
      commonPatterns: ['node_modules/', '*.log', '.env', 'build/', 'logs/'],
      advancedOptions: [
        { name: 'Negative patterns', example: '!important.log', desc: 'State to include that file (override)' },
        { name: 'Recursive patterns', example: '**/*.log', desc: 'Allows ignore deeply nested dir' },
        { name: 'Dir specific', example: 'build/', desc: 'Only that dir' },
      ],
      bestPractice: ['Use with template: github.com/github/gitignore', 'Keep it updated', 'Use global .gitignore'],
    },
    remoteRepo: {
      steps: [
        { cmd: 'git remote add origin "git repo url.git"', desc: 'Link local & remote repo' },
        { cmd: 'git remote -v', desc: 'Checking — shows URLs, flags to branch' },
        { cmd: 'git push -u origin master', desc: 'Push local changes. 1st time — because other git push cmd will know where it get pushed' },
      ],
      cloning: [
        'Creates new dir named after repo',
        'Initialises new git repo in that dir',
        'Fetches all data from remote repo & checks out default branch',
      ],
      cloningOptions: [
        { flag: '--branch <br-name>', desc: 'Clone specific branch — working on specific feature branch, save space & faster' },
        { flag: '--depth 1', desc: 'Limit number of commits downloaded. Shallow clone with history truncated. When need only latest snapshot of proj without full history.' },
      ],
    },
  },

  history: {
    title: 'Viewing & Searching History',
    commands: [
      {
        cmd: 'git show',
        desc: 'Display info about specific commit/git obj. Used to: review change before merge, context of spec commit, detailed info about tags & branches.',
        usage: [
          { syntax: 'git show <commit>', desc: 'commit hash / branch name / tag name → specific ones headed' },
          { syntax: 'git show', desc: 'Latest on current branch' },
        ],
        output: ['commit hash', 'author', 'Date', 'commit msg', 'diff — displays changes made in that commit (+) lines added, (-) removed lines'],
        flags: [
          { flag: '--format="%B"', desc: 'Spec format — customize output format. commit msg alone' },
          { flag: 'abc1234:path/to/file.txt', desc: 'Show specific files — only changes in that file in that commit' },
          { flag: '--stat abc1234', desc: 'Diff options — brief preview of changes, make quick to assess impact of commit' },
          { flag: 'abc1234 | less', desc: 'Less output — scroll through output at your own pace when output is large & overwhelming' },
        ],
      },
      {
        cmd: 'git log',
        desc: 'Entire commit history of repo. Git traverse commit graph & presents chronological list of commits.',
        output: ['All commits history from 1st', 'commit hash', 'author', 'Date & time', 'commit msg'],
        flags: [
          { flag: '--pretty=oneline', desc: 'Condense into single line (only hash & msg)' },
          { flag: '--author="John"', desc: 'Filter by author — commits made by John' },
          { flag: '--since="2weeks ago"', desc: 'Filter by date — last 2 weeks commits' },
          { flag: '--graph --oneline --decorate', desc: 'Visualized commit history — easy to view branches/merges/relations. Single line, add branch names & tags to output.' },
          { flag: '-p / --patch', desc: 'Each commit with changes it made → each commit with patchfile' },
          { flag: '--pretty=format:"%h - %an %ar %s"', desc: 'Custom log formatting — abbreviated hash, author name, time, commit msg' },
        ],
      },
      {
        cmd: 'git diff',
        desc: 'Shows differences between: working dir & staging area, staging area & last commit, 2 diff commits/branches.',
        output: ['(-) lines removed', '(+) lines added', 'context lines (without any prefix)', '1st lines — compared files', '@@  hunt of diff, shows content'],
        variants: [
          { syntax: 'git diff', desc: 'Working dir vs staging area → modifications pending in that file' },
          { syntax: 'git diff --cached', desc: 'Staging area vs Last commit → can also use for spec file' },
          { syntax: 'git diff <cmt1> <cmt2>', desc: 'Between 2 commits (hashes, tags, branch names)' },
          { syntax: 'git diff main..feature-branch', desc: 'Changes applied to main if were merged feature-branch into it' },
        ],
        options: [
          { flag: '--word-diff', desc: 'Changes word level instead line level' },
          { flag: '--stat', desc: 'Concise overview of how many files changed, insertions & deletions' },
          { flag: '--global color-ui auto', desc: 'Color coded output — easy to diff added & removed lines' },
        ],
      },
      {
        cmd: 'git blame',
        desc: 'Reveals history of each line of code.',
        usage: 'git blame <filename>',
        output: 'Each line with last commit modified it — 1st line → commit no. (author name, date, time (then 1) line of code)',
        flags: [
          { flag: '-w', desc: 'Ignore whitespace' },
          { flag: '-L flag', desc: 'Limit output → spec range' },
          { flag: '-e', desc: 'Include commit msg' },
        ],
        uses: ['debug', 'code reviews', 'code ownership'],
        tips: ['When large files → --incremental flag', 'Combined with other cmds for deeper insights'],
      },
      {
        cmd: 'git grep',
        desc: 'Searching history',
        variants: [
          { syntax: 'git grep "any-string"', desc: 'Search in working dir' },
          { syntax: 'git grep <pattern> (--all)', desc: 'Search in commit history, (-h) shows numbers' },
          { syntax: 'git log --grep="fix"', desc: 'All commits where commit msg includes word "fix"' },
          { syntax: 'git log --grep="John"', desc: 'Search by author — get all commits made by John' },
          { syntax: 'git log --since="date" --until="date"', desc: 'Commit msgs in date range' },
          { syntax: 'git rev-list --all -- <path/to/file>', desc: 'Specific file history' },
        ],
      },
      {
        cmd: 'git bisect',
        desc: 'Track source of issue, which commit introduced a bug. Uses Binary Search Algorithm through commit history.',
        howItWorks: 'Instead of checking each commit one by one, allows to halve number of commits need to check after each test. Mark known good commit & bad commit (func only).',
        steps: [
          { step: 1, desc: 'Initiate bisect', cmd: 'cd path/to/repo' },
          { step: 2, desc: 'Start', cmd: 'git bisect start' },
          { step: 3, desc: 'Mark bad', cmd: 'git bisect bad → current commit as bad' },
          { step: 4, desc: 'Mark good', cmd: 'git bisect good <commit hash> (known good commit hash — branch/tag)' },
          { step: 5, desc: 'Test → check → then commit. If bug → mark bad, if good → mark good', cmd: '' },
        ],
        eff: [
          'Automate tests → git bisect start --bad --good <from hash> -- exec "./run-tests.sh" → if test pass, marks good or otherwise bad',
          'Handle true bugs at diff times → create new branch for each identified bug to isolate',
          'View commit details: git bisect good → git show — view details before mark good/bad',
          'Reset: git bisect reset',
        ],
      },
      {
        cmd: 'git shortlog',
        desc: 'Summary view of commit history grouped by author — "who did what" view.',
        usage: ['git shortlog', 'git shortlog -s -n (numeric)'],
        output: 'author name (no. of commits), commit msg1, commit msg2 ... sorted by no. of commits (most active)',
      },
    ],
  },

  files: {
    title: 'Remove, Rename & File Permissions',
    rm: {
      desc: 'Delete file from local file system, stages that to for next commit. (reflects in commit history)',
      usage: 'git rm <filename> → action can\'t undone without recovery methods. Reflected in git status as deleted filename.',
      options: [
        { flag: '-r my-dir/', desc: 'Recursive removal — removes directory & all its contents. Permanently removes any dir/structure.' },
        { flag: '-f mod-file.txt', desc: 'Force removal — when file modified & not staged → git prev removal → that case -f to be used' },
        { flag: '--cached <filename>', desc: 'Keep local copy — sometimes want remove file from git index not from working dir. Remove from staging area (when file not to be tracked)' },
      ],
      recovery: [
        { case: 'Removed file & not committed', cmd: 'git checkout -- <file>', desc: 'Restores from last commit' },
        { case: 'Recover after commit by checkout to prev commit where file exists', cmd: 'git checkout HEAD~1 -- <filename>' },
      ],
    },
    mv: {
      desc: 'Move files from 1 location to another. Removes file reference & addition of new one. → renames them in git repo. Updates index.',
      usage: 'git mv <source> <destination> [recursively moves all files within dir]',
      examples: [
        { desc: 'Moving', cmd: 'git mv app.js src/app.js → moved into src dir' },
        { desc: 'Renaming', cmd: 'git mv src/app.js src/main.js' },
      ],
      why: 'Automatically staged, clear commit history. Don\'t move non tracked files, case sensitive filenames (even on macOS & apps).',
      checking: 'git status, git log --follow <file> → strictly tracks history of that file',
      bestPractice: 'Commit immediately, use descriptive names, use it to organise project structure.',
    },
    permissions: {
      desc: 'File permissions (Unix systems)',
      types: ['read (r) — 4', 'write (w) — 2', 'execute (x) — 1'],
      users: ['owner — owns file', 'group — shared access to file', 'others — users not owns & part of group'],
      octal: 'Octal no. = sum of r+w+x = 7, r-x = 5, r-- = 4',
      symbolic: '[-rwxr-xr--] = regular file, owner permission, group permission, others permission (only read)',
      chmod: [
        { example: 'chmod u+x myscript.sh', desc: 'Grant exec perm to owner' },
        { example: 'chmod g-w', desc: 'Remove write perm from group' },
        { example: 'chmod o=rx', desc: 'Set read & exec perm to others' },
        { example: 'chmod 755 myscript.sh', desc: 'All perm to owner, read & exec to others & group' },
      ],
      platforms: [
        { name: 'Unix/Linux', desc: 'Well defined, chmod works, git respects.' },
        { name: 'Windows', desc: 'Executable bit not exist in same way. To manage → set manually — exec perm after cloning. Use compatibility layer like WSL.' },
        { name: 'Cross platform', desc: 'Test script on all target systems. Communicate with team about perm settings.' },
      ],
    },
    gitattributes: {
      desc: 'Manage how git tracks perm for certain files in multi-platform env. Specify attr for files (text handling & merge strategies).',
      examples: ['*.sh text eol=lf → enforce line endings for shell scripts & python files', '*.py text eol=lf → help avoid perm issues from line endings'],
      purpose: 'Set executable bit → in some platforms. Myscript.sh (-text, eol=lf) → file should retain executable status.',
      commonIssues: [
        'Exec script not running → check perm & add tx perm',
        'Wrong perm after cloning → perm not appropriate in local env',
        'Git hooks & permissions → set perm for hook scripts: chmod +x .git/hooks/pre-commit',
        'Collab conflicts → use .gitattributes to manage filetypes',
      ],
    },
  },

  undoing: {
    title: 'Undoing Changes',
    gitObjectModel: {
      areas: ['Work-Dir (make changes)', 'Staging area / Index (prepare files to be committed)', 'Repo (committed snapshots of ur proj stored)'],
    },
    checkout: {
      desc: 'Switch branches / restore files. Revert changes in working dir to state of spec commit. (only affects working dir not others)',
      usages: [
        { cmd: 'git checkout <file>', desc: 'Replace to last committed version from curr branch. Irreversible → uncommitted changes lost. Git refuses → use -f (force flag) here' },
        { cmd: 'git checkout <cmt-hash> -- <file>', desc: 'Specific hash. Find from git log. -- distinguishes between hash & filename' },
      ],
      usecases: ['Discard local changes', 'Restore prev version', 'Revert merged changed'],
    },
    restore: {
      desc: 'Git 2.23 version introduced. More focused & user friendly than checkout. Works on all 3 obj models.',
      usages: [
        { cmd: 'git restore <file>', desc: 'In work dir: spec files and discard the changes [to last commit]' },
        { cmd: 'git restore <file1> <file2> <file3>', desc: 'In multi files' },
        { cmd: 'git restore --staged <file>', desc: 'Staged changes: modify before commit' },
        { cmd: 'git restore --source <cmt> <file>', desc: 'To specific commit — multiple files also given to unstaged' },
        { cmd: 'git restore --source <cmt> --worktree <file>', desc: 'Combined with: reflects state of working dir spec commit' },
        { cmd: 'git restore --source <cmt> -- <dir>/*', desc: 'All files in spec dir' },
      ],
    },
    reset: {
      desc: 'Move current branch pointer to different commit. Alters commit history of branch — directly HEAD pointer. Modifies HEAD, staging area, working dir (current in proj).',
      modes: [
        { name: 'Soft Reset', cmd: 'git reset --soft <cmt>', desc: 'Edit last commit without losing changes. Moves HEAD to spec commit only — safe. Moves HEAD to spec commit only.' },
        { name: 'Mixed Reset', cmd: 'git reset <cmt> / git reset --mixed <cmt>', desc: 'Move HEAD to spec commit & reset staging area to match it. When want to unstage & keep in work dir. (Redefine committing)' },
        { name: 'Hard Reset', cmd: 'git reset --hard <cmt>', desc: 'Moves HEAD to spec commit. Restages area. Alters working dir. When confident that they are no longer needed — destructive op.' },
      ],
      recovery: [
        { method: 'Reflog', desc: 'Tracks HEAD where it has been.', cmd: 'git reflog → identify hash & reset back with git reset' },
        { method: 'git revert', desc: 'Undo the changes that spec commit made and make a new commit — transparent.', cmd: 'git revert <cmt hash>' },
      ],
    },
    revert: {
      desc: 'Undo the changes that specific commit made and make a new commit — transparent.',
      usages: [
        { cmd: 'git revert <cmt hash>', desc: 'Opens def editor & asks for msg — def reverted <hash>' },
        { cmd: 'git revert HEAD~N..HEAD', desc: 'Multi files — spec range of commits' },
        { cmd: 'git revert -m <parent-no.> <merge-cmt-hash>', desc: 'Merge commit — specify which parent commit want to use as reference pt for revert' },
      ],
      conflicts: ['If conflicts → resolve & git revert --continue', 'If don\'t want → git revert --abort'],
    },
    stash: {
      desc: 'Safety stores the unfinished changes sep. → when runs, creates new stash. Working: modified tracked files, staged files, untracked files.',
      howItWorks: [
        'Create new stash entry as stash obj',
        'In .git dir → refs/stash',
        'After created, resets work dir to, ptr to latest stash — for clean state',
      ],
      usages: [
        { cmd: 'git stash', desc: 'Saves modified & staged changes' },
        { cmd: 'git stash -u', desc: 'Both tracked & untracked changes' },
        { cmd: 'git stash list', desc: 'Show with index' },
        { cmd: 'git stash apply', desc: 'Apply recent one. After applied, remove: they not autoremoved → git stash pop.' },
        { cmd: 'git stash apply stash@{2}', desc: 'Apply specific numbered one' },
        { cmd: 'git stash drop stash@{0}', desc: 'Drop specific stash' },
        { cmd: 'git stash clear', desc: 'All stashes cleared' },
        { cmd: 'git stash show -p stash@{0}', desc: 'Before applying, check what brings back' },
        { cmd: 'git stash save "msg"', desc: 'Give message to stash' },
      ],
    },
    clean: {
      desc: 'Remove untracked files from work dir. E.g. temp files created during dev, build artifacts, config files. Use after git status to be effective.',
      options: [
        { flag: '-f / --force', desc: 'Without this, git only shows what would be deleted' },
        { flag: '-d / -fd', desc: 'Removes untracked directories with files' },
        { flag: '-x', desc: 'Remove files ignored by .gitignore (caution)' },
        { flag: '-n / --dry-run', desc: 'Shows what would be deleted without actually delete (safer one)' },
      ],
    },
  },

  branches: {
    title: 'Branching',
    concepts: [
      { term: 'Branch', definition: 'A pointer to a specific commit in project history. Unique line of independent development that diverges from main codebase. Used for new features, bug fixes.', tag: 'core' },
      { term: 'Default branch', definition: 'Every repo has a default branch — main/master. It is the starting point for all other branches.', tag: 'core' },
      { term: 'HEAD pointer', definition: 'Refers to current commit in working dir. When new commit comes, HEAD moves there. With branches, it points to that branch\'s latest commit.', tag: 'core' },
      { term: 'Detached HEAD', definition: 'Points to a commit instead of a branch. Arises when you checkout a specific commit/tag. Create a branch or merge them — then only it\'ll resolve.', tag: 'concept' },
      { term: 'Remote branch', definition: 'Branch that exists on the remote repo. Tracked locally as origin/<branch-name>.', tag: 'concept' },
    ],
    commands: [
      {
        cmd: 'git branch',
        desc: 'List all local branches. * on current branch (you\'re in). Interacts with branch references stored in .git/refs/heads dir.',
        output: ['* main', '  feature/auth', '  hotfix/login'],
        flags: [
          { flag: '-a', desc: 'All branches including remote branches' },
          { flag: '-v', desc: 'More info — last commit on each branch & if tracking remote' },
          { flag: '-r', desc: 'List remote branches with origin/ prefix' },
          { flag: '--list "feature/*"', desc: 'Filter branches by name pattern' },
          { flag: '| sort', desc: 'Sort by alphanumeric order (no direct cmd, combine with Unix)' },
        ],
      },
      {
        cmd: 'git branch <br-name>',
        desc: 'Create a new branch. NOT a duplicate of project files — a new pointer referencing same commit as current branch. It is created but not redirected into it.',
        output: [''],
        flags: [
          { flag: '-d <name>', desc: 'Delete — only works if fully merged, else error thrown' },
          { flag: '-D <name>', desc: 'Force delete — without checking merging, delete it' },
          { flag: '-m <new-name>', desc: 'Rename when on current branch' },
          { flag: '-m <old> <new>', desc: 'Rename when on different branch' },
        ],
      },
      {
        cmd: 'git checkout -b <br-name>',
        desc: 'Creating & switching in 1 step. After git 2.23 version — switch cmd used instead.',
        output: ["Switched to a new branch 'feature/auth'"],
        flags: [
          { flag: '--track', desc: 'Create new branch & set it to track remote branch' },
          { flag: '--', desc: 'Specify file to restore from another branch without switching branches' },
        ],
      },
      {
        cmd: 'git switch <br-name>',
        desc: 'Newly added — solely for branch switching. Updates HEAD ptr to desired branch. Updates work dir to match state of branch. If uncommitted changes in work dir — git checks if those changes applied to target branch (not staged → block switching).',
        output: ["Switched to branch 'main'"],
        flags: [
          { flag: '-b <new-br>', desc: 'Create & switch — saves time & error' },
          { flag: '-c <new-br>', desc: 'Same as -b (alternate syntax)' },
        ],
      },
      {
        cmd: 'git checkout <br-name>',
        desc: 'Switch branches OR restore files. Working: (i) update HEAD ptr to new branch (ii) git replace files in work dir with version that exists in new branch, ensures local env reflects state of that branch (iii) uncommitted changes — don\'t allow switching until committed/stashed.',
        output: ["Switched to branch 'feature'"],
        flags: [
          { flag: '-b', desc: 'Create new branch & switch' },
          { flag: '-- <filepath>', desc: 'Undo — restore file (caution)' },
        ],
      },
      {
        cmd: 'git push origin --delete <br-name>',
        desc: 'Delete a remote branch.',
        output: ['To github.com/user/repo.git', ' - [deleted] feature/auth'],
        flags: [
          { flag: 'fetch --prune', desc: 'Update local view of remote repo, remote refs to deleted' },
          { flag: 'branch -r', desc: 'List remote branches to verify deletion' },
        ],
      },
    ],
    handlingUncommitted: [
      { method: 'Stash changes', desc: 'If not committed, temp store → git stash → git switch br-name → after switching, stash retrieved, git stash pop (applied & permanently deleted)' },
      { method: 'Commit changes', desc: 'Commit before switching' },
      { method: 'Discard changes', desc: 'git checkout -- . or git switch <br-name> (can\'t undo)' },
    ],
    bestPractices: [
      'Keep focused branches — one feature per branch',
      'Use descriptive names',
      'Regularly merge changes to avoid drift',
      'Delete merged branches to keep repo clean',
      'Use prefix for categorizing: feature/, bugfix/, hotfix/',
      'Short descriptive names: feature/auth',
      'Use issue numbers in names',
      'Avoid special chars like —, \', _',
    ],
    remoteCreation: [
      'Create locally then push to remote',
      'git branch <br-name>',
      'git push origin <br-name>   ← def name of remote repo',
      '-u → upstream tracking flag — easy to push/pull changes in future',
    ],
    renaming: {
      local: ['git branch -m new-br-name  ← when on curr branch', 'git branch -m old-br-name new-br-name  ← when on diff branch'],
      internally: 'Updates internal ref in .git/refs/head/. Ptr points to same commit with diff commit (br-name).',
      remote: ['(i) rename local branch', '(ii) git push origin new-br-name', '(iii) delete old remote branch'],
      tip: 'Easy to use GUIs like github, sourcetree, GitKraken',
    },
  },
 
  remote: {
    title: 'Remote & Collaboration',
    concepts: [
      { term: 'Remote repository', definition: 'Ptr to version of project hosted on server — github, gitlab, Bitbucket or even own server. In local, stored in .git/config.', tag: 'core' },
      { term: 'origin', definition: 'Default name for the remote repo when you clone or add remote. Just a convention — can be renamed.', tag: 'concept' },
      { term: 'Tracking branch', definition: 'Local branch that tracks a remote branch. Allows git push/pull without specifying remote and branch each time.', tag: 'concept' },
    ],
    commands: [
      {
        cmd: 'git remote',
        desc: 'List of remotes. Stored locally in .git/config.',
        output: ['origin'],
        flags: [
          { flag: '-v', desc: 'Detailed with URLs — shows fetch and push URLs' },
          { flag: 'add <name> <url>', desc: 'Add new remote. name = remotename (usually origin), url = repo-url' },
          { flag: 'set-url <name> <new-url>', desc: 'Modify existing remote URL' },
          { flag: 'remove <name>', desc: 'Remove a remote' },
        ],
      },
      {
        cmd: 'git fetch <rem-name>',
        desc: 'Retrieve updates from remote repo WITHOUT automatic merge into local branch. How: (1) connect to remote (2) download commits & stores in .git dir (3) update tracking branches.',
        output: ['From https://github.com/user/repo', '   4a2f1c3..9f3a1b2  main -> origin/main'],
        flags: [
          { flag: '<rem-name> <br-name>', desc: 'Fetch specific branch only' },
          { flag: '--tags', desc: 'Useful for versioning / releases' },
        ],
      },
      {
        cmd: 'git diff <loc-br> <rem>/<br-name>',
        desc: 'Diff between local branch and remote branch after fetch.',
        output: ['+new line added', '-old line removed'],
        flags: [],
      },
      {
        cmd: 'git pull',
        desc: '2 operations combined: git fetch + git merge. How: (1) Identify remote (by url) (2) fetch changes (3) merge changes.',
        output: ['Updating 4a2f1c3..9f3a1b2', 'Fast-forward', ' README.md | 2 ++', '1 file changed'],
        flags: [
          { flag: '--rebase origin main', desc: 'From feature branch, keep history clean' },
          { flag: '--rebase', desc: 'Rebase/merge by default' },
        ],
      },
      {
        cmd: 'git branch --set-upstream-to=origin/main',
        desc: 'When frequently pulling — set upstream to simplify. After this git pull is enough.',
        output: ["Branch 'main' set up to track remote branch 'main' from 'origin'."],
        flags: [
          { flag: '--ff-only', desc: 'Only pull if merge is fast-forward' },
        ],
      },
      {
        cmd: 'git push <remote> <branch>',
        desc: 'Upload local content to remote. How: (1) authentication to give permission (2) check diff — only new commits/obj transferred (3) update reference.',
        output: ['Enumerating objects: 5, done.', 'To https://github.com/user/repo.git', '   4a2f1c3..9f3a1b2  main -> main'],
        flags: [
          { flag: '-u origin <upstream-br>', desc: 'For setting 1st time then git push enough. To see current tracking branches → git branch -vv' },
          { flag: '--force', desc: 'Overwrite commits on remote' },
          { flag: '--force-with-lease', desc: 'Safe — push only if remote not updated' },
          { flag: '--dry-run', desc: 'See what happens when pushed, without actual push' },
          { flag: '--tags', desc: 'Push local tags to remote repos' },
          { flag: '--set-upstream', desc: 'Set upstream tracking relationship between local & remote' },
          { flag: '--delete <br-name>', desc: 'Delete branch on remote repo' },
        ],
      },
    ],
    pullStrategies: [
      { name: 'git config --global pull.rebase true', desc: 'Rebase/merge by default' },
      { name: 'git branch --set-upstream-to=origin/main', desc: 'When frequently pulling — set upstream to simplify' },
      { name: 'git pull --ff-only', desc: 'Only pull if merge is fast-forward' },
    ],
    conflicts: 'When push conflicts arise: fetch, merge/rebase, push.',
  },
 
  merge: {
    title: 'Merge & Rebase',
    concepts: [
      { term: 'Merging', definition: 'Integrating changes from 1 branch to other. Default — 3 way merging → latest common ancestor of 2 branches being merged along with changes made in each branch.', tag: 'core' },
      { term: 'Fast Forward Merge', definition: 'Simple & understand. When branch merging into has no new commits (branches not diverged). Git move ptr of target branch forward to point tip of merged branch.', tag: 'concept' },
      { term: 'Three-Way Merge', definition: 'Git combine changes from 2 branches into a common ancestor — more accurate integration of diverged changes. Uses 3 points: Base commit (common ancestor), Current commit (tip of 1st/current branch), Other commit (tip of 2nd/merged in).', tag: 'concept' },
      { term: 'Merge Commit', definition: 'Has 2 parent commits. Created in three-way merge. A(Base) → B(curr) + C(other) → after merge → D(final merge commit) with B & C as 2 parents.', tag: 'concept' },
      { term: 'Squash Merge', definition: 'Takes all changes from feature branch & commit to single commit before merge into target. 1 commit with rep all changes. Simple history, easy reverts, clear context.', tag: 'concept' },
      { term: 'Rebase', definition: 'Move or combine sequence of commits to new base commit. Creates new commits representing same changes as orig ones but with diff parent commit. Clean history, easy navigate, better collab.', tag: 'core' },
      { term: 'Interactive Rebase', definition: 'git rebase -i — to clean up commits before they become part of main history. Open interactive editor list last N commits. Change "pick" to "squash" if you want to merge into single commit.', tag: 'concept' },
    ],
    commands: [
      {
        cmd: 'git merge <branch>',
        desc: 'Merge branch into current. Default 3-way merge. Merge process: (i) identify branches & merge base (ii) perform merge commit (iii) handle merge conflicts (iv) finalise merge.',
        output: ['Merge made by the \'recursive\' strategy.', ' feature.js | 10 ++++++++++', '1 file changed, 10 insertions(+)'],
        flags: [
          { flag: '--no-ff <branch>', desc: 'Force — create new merge commit even when merge completes as fast-forward, to doc the integration' },
          { flag: '--abort', desc: 'Undo merge — revert to before merge state (prev state)' },
          { flag: '--squash <branch>', desc: 'Squash all feature commits into one before merging' },
        ],
      },
      {
        cmd: 'git config --global merge.ff true',
        desc: 'Enforce (default) — made it default merge strategy.',
        output: [''],
        flags: [],
      },
      {
        cmd: 'git rebase origin/main',
        desc: 'Replay commits on top of latest commit of main. Workflow: (1) git status [if changes, commit/stash] (2) git checkout feature (3) git fetch from origin (latest from main) (4) git rebase origin/main (replay cmts on top of lat cmts(main)) (5) handle conflicts [status, add, git rebase --continue].',
        output: ['Successfully rebased and updated refs/heads/feature.'],
        flags: [
          { flag: '-i HEAD~N', desc: 'Interactive rebase last N commits — editing commit msg, multiple cmts → interactive rebasing, change cmds as needed' },
          { flag: '--onto <newbase> <upstream> <branch>', desc: 'Where cmts placed after rebase, starting pt of cmts to move, br contains cmts to rebase' },
          { flag: '--abort', desc: 'Abort rebase — recover conflicts' },
          { flag: '--skip', desc: 'Skip conflicting commit' },
          { flag: '--continue', desc: 'Continue after resolving conflicts' },
        ],
      },
      {
        cmd: 'git merge --abort',
        desc: 'Abort merge when not go as expected. When: unresolved conflicts, wrong merge target, change of priorities. What happens: (1) restores working dir — discard changes made by merge (2) clears index — remove staged merge conflict (3) updates the HEAD — move back to commit.',
        output: [''],
        flags: [],
      },
      {
        cmd: 'git revert -m 1 <merge-cmt-hash>',
        desc: 'Recover from bad merge — create new commit, reverses changes by that merge.',
        output: ['[main 7a3b1c2] Revert "Merge branch feature"'],
        flags: [],
      },
    ],
    mergeStrategies: [
      { name: 'Recursive', desc: 'Default one — 2 branches — handle complex merge (multiple branched). Uses: common ancestor (baseline), change detection (diffs), 3 way merge. Nuances: diverged significantly, manually resolve.' },
      { name: 'Octopus', desc: 'Merging > 2 branches at once into main. Efficient. Only handles non-overlapping. If not — resolve conf manually. eg: git checkout main → git merge b1 b2 b3.' },
      { name: 'Resolve', desc: 'Simpler — straightforward changes — only 2 branches, less sophisticated than recursive. Not for complex ones. 3 way merge — not recommended. eg: git merge -s resolve feature.' },
      { name: 'Subtree', desc: 'Incorporate one repo as subdir within another repo. Combine multiple proj/libraries into single repo. eg: git remote add -f other-repo "repo-url.git" → git merge -s subtree other-repo/main (--allow-unrelated — merging unrelated repo).' },
    ],
    conflictResolution: {
      markers: [
        '<<<<<<< HEAD — beginning of change',
        '======= — separates from incoming changes',
        '>>>>>>> br-name — end of incoming change from branch trying to merge',
      ],
      strategies: ['Manual', 'Merge tool → configure & use (globally)', 'Accept incoming changes → theirs strategy'],
      automating: ['git rerere (reuse recorded resolution) — git config --global rerere.enabled true — git remembers how you resolved conflicts & applies same resolution to similar conf in future', 'Regularly pull changes'],
      tools: ['git mergetool', 'vimdiff', 'meld', 'KDiff3 — GUI'],
      recovery: ['Undo merge: git merge --abort → prev state', 'Small commits & focus', 'Team communication'],
    },
    mergeVsRebase: {
      merge: ['Creates new commit from 2 branches, preserve individual histories', 'Visual record of how branches diverged & together'],
      rebase: ['Rewrites commit history by moving entire branch to begin on tip of another branch', 'Linear history — like changes made in straight line'],
      useWhenMerge: ['Preserve complex history', 'Multiple collab', 'See actual pt of div & convergences'],
      useWhenRebase: ['When in feature, want clean history before merge into shared', 'Update with latest changes', 'Focused, meaningful commits'],
      betterFlow: [
        'git checkout feature',
        'git fetch origin',
        'git rebase origin/main  ← rebase',
        'git checkout main',
        'git merge feature        ← merge',
        'git branch -d feature    ← clean',
      ],
    },
    interactiveRebaseCommands: [
      { cmd: 'pick', desc: 'Use commit as-is' },
      { cmd: 'reword', desc: 'Use commit but edit msg' },
      { cmd: 'edit', desc: 'Pause rebase, allows edit' },
      { cmd: 'squash', desc: 'Combine commits' },
      { cmd: 'fixup', desc: 'Discard commit msg' },
      { cmd: 'drop', desc: 'Remove commit entirely' },
    ],
    splittingCommits: {
      why: ['Clarity', 'Easier reviews', 'Revert changes'],
      steps: [
        'Stash changes',
        'Log for clarity',
        'git rebase -i HEAD~N → pick to edit',
        'Reset commit: git reset HEAD~1',
        'Stage by add',
        'Commit',
        'rebase --continue',
      ],
    },
  },

  advanced: {
    title: 'Advanced Git',
    sample: true,
    commands: [
      { cmd: 'git tag v1.0.0', desc: 'Create a lightweight tag' },
      { cmd: 'git tag -a v1.0.0 -m "msg"', desc: 'Create annotated tag' },
      { cmd: 'git hooks', desc: 'Scripts triggered at git events' },
      { cmd: 'git submodule add <url>', desc: 'Add a submodule' },
      { cmd: 'git reflog', desc: 'History of HEAD movements' },
    ],
  },
}
