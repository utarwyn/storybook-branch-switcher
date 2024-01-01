# Storybook Branch switcher

A Storybook addon to navigate between multiple Git branches. \
Also a command-line tool to automatically generate one instance per branch.

![Screenshot of add-on in action in Storybook](./docs/screenshot.jpg)

## Installation

Install the following module with npm:

```sh
npm i --save-dev storybook-branch-switcher
```

or with yarn:

```sh
yarn add -D storybook-branch-switcher
```

Then, add following content to `.storybook/main.js`

```js
module.exports = {
  addons: ['storybook-branch-switcher']
};
```

## CLI

### Usage

This package exports a script called `sb-branch-switcher` which will automatically generate one Storybook instance per
branch, based on your Git workflow.

### CLI Configuration

The CLI needs a configuration file located at `.storybook/.branches.json` by default. But you can create this file in
another location and pass the path to the CLI with the `--config` or `--c` argument.

Example : `sb-branch-switcher --config libs/storybook-host/.storybook/.branches.json`

Here is the explanation of all available options:

| Key            | Default        | Description                                                           |
|----------------|----------------|-----------------------------------------------------------------------|
| from           | -              | **(mandatory)** Where the Storybook instance is located after a build |
| to             | -              | **(mandatory)** Where all Storybook instances will be copied          |
| directory      | current folder | Absolute path where the project belongs                               |
| default_branch | master         | Your default Git branch                                               |
| default_root   | true           | Copy instance for default branch into root folder                     |
| provider       | -              | Configuration to retrieve branches and commits to process             |

### Bitbucket (opened PRs)

This provider enables you to generate one Storybook instance per opened PR of a Bitbucket repository (supports cloud and
on-premise servers).

| Key        | Default               | Description                                                |
|------------|-----------------------|------------------------------------------------------------|
| type       | -                     | **(mandatory)** must be **"bitbucket"**                    |
| project    | -                     | **(mandatory)** name of the Bitbucket project to target    |
| repository | -                     | **(mandatory)** name of the Bitbucket repository to target |
| url        | https://bitbucket.org | Bitbucket host to connect to                               | 

If the Bitbucket instance needs an authorization, you can pass the HTTP token to the Rest API in environment
variable `BITBUCKET_TOKEN`.

### Configuration file example

```json
{
  "from": "dist/storybook",
  "to": "dist/storybook-bundle",
  "default_branch": "master",
  "default_root": true,
  "provider": {
    "type": "bitbucket",
    "project": "my-project",
    "repository": "my-design-system"
  }
}
```
