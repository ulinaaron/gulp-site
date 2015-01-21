# Gulp Site Generator
A barebones site generator using Gulp. This will allow you to create simple sites with shared markup components for a header, footer, or sidebar. This is not a proper solution for sites that require blog like components. For that, you should use something like Jekyll or Middleman.

Additionally, this generator uses Libsass (Sass), BrowserSync, and can optimize images.

## Requirements
You must have the following setup and rockin on your local machine:
- [npm](https://github.com/npm/npm)
- [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- [bower](http://bower.io/#install-bower)

## Setup

From the command line, open the `gulp-site` project folder. Then run the following command:

```shell
npm install
```

If all the prerequisites are met, this will scaffold out your basic gulp-site.

Now you can run `gulp` from the root project folder. While `gulp` is running it will watch for any changes to your HTML source or asset sources. You will also be given URLs to view your website when you initially run the command. By default this URL is `http://localhost:7280`.


## Setting up hosting with Github Pages

The gulp-site generator uses a plugin called `gulp-gh-pages` to allow deployment from the command line.
To push your site up to Github pages you must first initialize the `gh-pages` branch.'

```shell
git checkout --orphan gh-pages
git rm -rf .
touch README.md
git add README.md
git commit -m "Init gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

If all goes well, you will be able to go to the Settings page of your repository to find out the published address of your site. Of course if you are using a domain, that will require more configuration. See more help on this [here](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/).

### Deploying

Once the gh-pages branch is initialized you can now deploy using the command `gulp deploy`. This will take the contents of your build folder and move it to the gh-pages branch.

*Credit to [gulp-gh-pages](https://github.com/rowoot/gulp-gh-pages/) for the initialization steps.*