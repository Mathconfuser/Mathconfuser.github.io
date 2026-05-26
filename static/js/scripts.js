const contentDir = 'contents/';
const configFile = 'config.yml';

const defaultSections = [
    { id: 'home', label: 'HOME', title: 'Home', file: 'home.md', icon: 'bi-person-lines-fill' },
    { id: 'publications', label: 'PUBLICATIONS', title: 'Publications', file: 'publications.md', icon: 'bi-file-text-fill' },
    { id: 'awards', label: 'AWARDS', title: 'Awards', file: 'awards.md', icon: 'bi-award-fill' },
];

const defaultConfig = {
    template: 'minimal',
    'profile-photo': 'static/assets/img/photo.jpeg',
    favicon: 'static/assets/favicon.jpeg',
    'last-updated': 'Last updated: 2026-05-26',
    sections: defaultSections,
};

let pageSections = defaultSections;

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function normalizeImagePath(src = '') {
    const value = String(src).trim();
    if (!value) return value;
    if (/^(https?:)?\/\//i.test(value) || /^(data:|mailto:|#|\/)/i.test(value)) return value;
    if (value.includes('/')) return value;
    return `static/assets/img/${value}`;
}

function sectionFromConfig(section) {
    if (typeof section === 'string') {
        return {
            id: section,
            label: section.toUpperCase(),
            title: section.charAt(0).toUpperCase() + section.slice(1),
            file: `${section}.md`,
        };
    }

    return {
        id: section.id,
        label: section.label || section.id.toUpperCase(),
        title: section.title || section.label || section.id.toUpperCase(),
        file: section.file || `${section.id}.md`,
        icon: section.icon || '',
    };
}

function applyConfig(config) {
    Object.keys(config).forEach(key => {
        const element = document.getElementById(key);
        if (element && typeof config[key] !== 'object') {
            element.innerHTML = config[key];
        }
    });

    document.body.dataset.template = config.template || defaultConfig.template;

    const titleText = config.title || config['page-top-title'];
    if (titleText) {
        document.title = titleText;
        const titleElement = document.getElementById('title');
        if (titleElement) titleElement.innerHTML = titleText;
    }

    const profilePhoto = document.getElementById('profile-photo');
    if (profilePhoto && config['profile-photo']) {
        profilePhoto.src = normalizeImagePath(config['profile-photo']);
    }

    const favicon = document.getElementById('favicon-link');
    if (favicon && config.favicon) {
        favicon.href = normalizeImagePath(config.favicon);
    }
}

function renderNavigation(sections) {
    const nav = document.getElementById('section-nav');
    nav.innerHTML = '';

    sections.forEach(section => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const anchor = document.createElement('a');
        anchor.className = 'nav-link me-lg-3';
        anchor.href = `#${section.id}`;
        anchor.dataset.page = section.id;
        anchor.textContent = section.label;

        li.appendChild(anchor);
        nav.appendChild(li);
    });
}

function renderSectionShells(sections) {
    const root = document.getElementById('sections-root');
    root.innerHTML = '';

    sections.forEach(section => {
        const wrapper = document.createElement('section');
        wrapper.className = 'page-section';
        wrapper.id = section.id;
        wrapper.dataset.page = section.id;

        const container = document.createElement('div');
        container.className = 'container px-5';

        const header = document.createElement('header');
        const h2 = document.createElement('h2');
        h2.id = `${section.id}-subtitle`;

        if (section.icon) {
            const icon = document.createElement('i');
            icon.className = `bi ${section.icon}`;
            h2.appendChild(icon);
            h2.appendChild(document.createTextNode(' '));
        }
        h2.appendChild(document.createTextNode(section.title));

        const body = document.createElement('div');
        body.className = 'main-body';
        body.id = `${section.id}-md`;

        header.appendChild(h2);
        container.appendChild(header);
        container.appendChild(body);
        wrapper.appendChild(container);
        root.appendChild(wrapper);
    });
}

function setupMarkdown() {
    const renderer = new marked.Renderer();

    renderer.image = function (href, title, text) {
        if (typeof href === 'object') {
            const token = href;
            href = token.href;
            title = token.title;
            text = token.text;
        }

        const safeHref = escapeHtml(normalizeImagePath(href));
        const safeTitle = title ? ` title="${escapeHtml(title)}"` : '';
        const safeAlt = escapeHtml(text || '');
        return `<img src="${safeHref}" alt="${safeAlt}"${safeTitle} loading="lazy">`;
    };

    marked.use({ renderer, mangle: false, headerIds: false });
}

function markdownHasMath(markdown) {
    return /(^|[^\\])(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\(|\\\[|\\begin\{)/.test(markdown);
}

function ensureMathJax() {
    if (window.MathJax && (MathJax.typeset || MathJax.typesetPromise)) {
        return Promise.resolve();
    }

    if (document.getElementById('MathJax-script')) {
        return new Promise(resolve => {
            document.getElementById('MathJax-script').addEventListener('load', resolve, { once: true });
        });
    }

    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true,
            processRefs: true,
            tags: 'ams',
        },
    };

    return new Promise(resolve => {
        const script = document.createElement('script');
        script.id = 'MathJax-script';
        script.async = true;
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
}

function typesetMath() {
    if (window.MathJax && MathJax.typesetPromise) return MathJax.typesetPromise();
    if (window.MathJax && MathJax.typeset) MathJax.typeset();
    return Promise.resolve();
}

function loadMarkdownSections(sections) {
    sections.forEach(section => {
        let hasMath = false;

        fetch(contentDir + section.file)
            .then(response => {
                if (!response.ok) throw new Error(`Cannot load ${section.file}`);
                return response.text();
            })
            .then(markdown => {
                hasMath = markdownHasMath(markdown);
                document.getElementById(`${section.id}-md`).innerHTML = marked.parse(markdown);
            })
            .then(() => {
                if (hasMath) return ensureMathJax().then(typesetMath);
                return Promise.resolve();
            })
            .catch(error => console.log(error));
    });
}

function currentPageId() {
    const id = window.location.hash.replace('#', '');
    return pageSections.some(section => section.id === id) ? id : pageSections[0].id;
}

function showPage(id = currentPageId()) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.toggle('active', section.dataset.page === id);
    });

    document.querySelectorAll('#section-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === id);
    });

    document.body.classList.toggle('home-page-active', id === 'home');

    const page = pageSections.find(section => section.id === id);
    if (page) {
        document.title = `${page.title} | ${document.getElementById('page-top-title').textContent || 'Homepage'}`;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function setupNavbarCollapse() {
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );

    responsiveNavItems.forEach(responsiveNavItem => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
}

function setupPublicationInteractions() {
    document.addEventListener('click', event => {
        if (event.target.closest('.publication-link')) {
            event.stopPropagation();
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetch(contentDir + configFile)
        .then(response => response.text())
        .then(text => {
            const userConfig = jsyaml.load(text) || {};
            const config = { ...defaultConfig, ...userConfig };
            pageSections = (config.sections || defaultSections).map(sectionFromConfig);

            applyConfig(config);
            setupMarkdown();
            renderNavigation(pageSections);
            renderSectionShells(pageSections);
            setupNavbarCollapse();
            setupPublicationInteractions();
            loadMarkdownSections(pageSections);
            showPage();
        })
        .catch(error => console.log(error));
});

window.addEventListener('hashchange', () => showPage());
