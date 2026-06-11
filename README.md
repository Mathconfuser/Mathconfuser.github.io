# Haojun Bai Academic Homepage

This is a lightweight GitHub Pages academic homepage. The page content is written in Markdown under `contents/`, while the menu, images, and visual template are controlled by `contents/config.yml`.

## Available Templates

Change the `template` value in `contents/config.yml`:

```yaml
template: minimal
```

Available choices:

- `minimal`: current default, a clean paged academic layout without a background image.
- `atelier`: more designed editorial style with a quieter image treatment, side headings, and a refined research-note feel.
- `classic`: clean academic style with a strong hero image and right-side profile photo.
- `paper`: warmer paper-like style with a round profile photo.
- `sidebar`: modern layout with the profile photo on the left and wider reading space.

The top navigation works like lightweight pages: `#home`, `#publications`, `#awards`, etc. Only one page is shown at a time.

## Edit Content

Main content files:

- `contents/home.md`
- `contents/publications.md`
- `contents/awards.md`

You can write normal Markdown in these files. LaTeX formulas are supported with `$...$`, `\(...\)`, `$$...$$`, and `\[...\]`.

## Add a New Menu Item

For example, to add a `TEACHING` section:

1. Create `contents/teaching.md`.
2. Add this entry to `sections` in `contents/config.yml`:

```yaml
  - id: teaching
    label: TEACHING
    title: Teaching
    file: teaching.md
    icon: bi-easel-fill
```

The `id` becomes the page anchor, the `label` appears in the top menu, the `title` appears as the section heading, and the `file` points to the Markdown file.

Bootstrap Icons can be used for `icon`: https://icons.getbootstrap.com/

## Remove a Page

To remove a page from the website:

1. Delete or comment out its entry under `sections` in `contents/config.yml`.
2. Optionally delete the matching Markdown file from `contents/`.

For example, to remove `AWARDS`, remove this block:

```yaml
  - id: awards
    label: AWARDS
    title: Awards
    file: awards.md
    icon: bi-award-fill
```

## Last Updated

By default, the site reads the latest commit date from GitHub and shows it automatically:

```yaml
last-updated: auto
github-owner: Mathconfuser
github-repo: Mathconfuser.github.io
github-branch: main
last-updated-timezone: Asia/Shanghai
```

If the GitHub API cannot be reached, the site uses this fallback:

```yaml
last-updated-fallback: 'Last updated: 2026-05-26'
```

To set it manually instead, replace `auto` with fixed text:

```yaml
last-updated: 'Last updated: 2026-06-11'
```

## Images

Put uploaded images in:

```text
static/assets/img/
```

In `contents/config.yml`, the profile image can be written as either a full path or a simple filename:

```yaml
profile-photo: photo.jpeg
```

In Markdown files, both of these work:

```markdown
![Description](photo.jpeg)
![Description](static/assets/img/photo.jpeg)
```

If you only write the filename, the page will automatically look for it in `static/assets/img/`.

## Deploy

For GitHub Pages, push the repository to a branch enabled under repository `Settings -> Pages`. The website will usually update within a few minutes after pushing.

## License

Based on the original academic homepage template by Sen Li, licensed under the MIT License.
