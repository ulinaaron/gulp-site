# Gulp Site Generator
A barebones site generator using Gulp.

## Requirements
You must have the following setup and rockin on your local machine:
- [npm](https://github.com/npm/npm)
- [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- [bower](http://bower.io/#install-bower)

## Setting up hosting with Github

The Gulp site generator uses a plugin called `gulp-gh-pages` to allow deployment from the command line.
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

*Credit to [gulp-gh-pages](https://github.com/rowoot/gulp-gh-pages/) for the initialization steps.*