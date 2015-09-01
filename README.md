Content Editor
==============

Content Editor is a web interface for editing documents on GitHub. It allows content writers to create, edit, upload, move and delete files from a web browser, lowering the amount of technical knowledge required to manage files on GitHub.

With the growth in popularity of static-site generators, it is often desirable to store content as simple text files alongside the code files that make up a website. This can present a problem for content writers, as code repositories typically use version control software to keep track of file changes which can be difficult to use and require a degree of technical know-how. By comparison, sites that use content management systems, i.e. that store content as data in a database, typically provide a web-based administration panel with a rich-text editor that is more accessible for most content authors.

Content Editor tries to plug this gap by providing a user experience that is simple and responsive, whilst at the same time respecting the difference between these architectures. There are a plethora of static-site generators: Jekyll, Hexo, Hugo, Pelican, Middleman, Metalsmith, Harp, Docpad...etc each with their own ideas about the best ways to store content. By default, Content Editor simply provides a direct text editor for content without trying to be too clever with assumptions on how the files are formatted.

Authentication and Security
---------------------------

When first navigating to Content Editor, users are directed to login with their GitHub username and password. This is so requests can be made to the GitHub API on the user's behalf using BASIC authentication. As Content Editor is a static website these credentials are sent directly from the user's computer to the GitHub servers over HTTPS without intermediary, so the user's credentials are entirely secure and never exposed to a third-party.

Content Editor prefers BASIC authentication to OAuth, as the latter would require Content Editor to run a server for the sole purpose of authentication and would slow down the user experience by waiting on this server to authenticate requests to GitHub. The drawback is that this entails giving Content Editor a certain amount of trust that it does not abuse the slightly more permissive system. For re-assurance, technical users are encouraged to go through the source code for Content Editor on GitHub to allay any concerns of possible abuses.

To save users from typing in their credentials every time they use Content Editor, their credentials are stored using their browser's `localStorage` feature, which saves them on the user's computer. As Content Editor is served exclusively over HTTPS only Content Editor itself has access to the stored credentials. Content Editor is also careful not to execute any user provided code that would leave these credentials open to XSS attacks.

Navigation
----------

Content Editor uses the following format for URLs, reflecting GitHub's own organisation of repositories:

    https://content-editor.surge.sh/:owner:/:repo:/:branch:/:path

Each repository has an owner and a name. The owner is the user or organisation who's responsible for the repository. Whilst there may be many collaborators who have been granted permission to edit a repository, the project is still attributable to a single owner.

For each repository, there can be multiple branches. These can be different versions of the same project but with minor changes, like a new feature that someone's working on, or they can contain a completely different set of files for a purpose that run's complementary to the other branches, such as a place to keep documentation files. Most repositories tend to use the `master` branch most of the time as it's the default when creating a new repository, but it's also quite common for sites that are hosted on GitHub Pages to use the `gh-pages` branch to.

After that, the path is just made up of files and folders, just like a typical file-system.

Take this URL for an example:

    https://content-editor.surge.sh/facebook/react/master/docs/_posts/2013-06-05-why-react.md

From the URL, you can see that it is a file on the master branch of the React repository that's owned by Facebook.

Contributing
------------

1. [Fork it](https://github.com/mushishi78/content-editor/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
