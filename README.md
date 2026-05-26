# Haojun Bai Academic Homepage

This is a lightweight GitHub Pages academic homepage. The page content is written in Markdown under `contents/`, while the menu, images, and visual template are controlled by `contents/config.yml`.

## Available Templates

Change the `template` value in `contents/config.yml`:

```yaml
template: atelier
```

Available choices:

- `atelier`: more designed editorial style with a quieter image treatment, side headings, and a refined research-note feel.
- `classic`: clean academic style with a strong hero image and right-side profile photo.
- `paper`: warmer paper-like style with a round profile photo.
- `sidebar`: modern layout with the profile photo on the left and wider reading space.

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

## Images

Put uploaded images in:

```text
static/assets/img/
```

In `contents/config.yml`, the profile and hero images can be written as either full paths or simple filenames:

```yaml
profile-photo: photo.jpeg
hero-image: background.jpeg
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
