export function initNavigation() {
    const nav = document.querySelector('nav');
    const openBtn = document.getElementById('open-btn');
    const sideItems = {
        home: document.getElementById('side-home'),
        historico: document.getElementById('side-historico'),
        planejamento: document.getElementById('side-planejamento'),
        gastosPrevistos: document.getElementById('side-gastos-previstos')
    };

    // Define which sections belong to each navigation item
    const sectionGroups = {
        home: ['saldo', 'transacao'],
        historico: ['historico'],
        planejamento: ['planejamento'],
        gastosPrevistos: ['gastos-previstos']
    };

    // Toggle navigation
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            nav?.classList.toggle('collapsed');
            const main = document.querySelector('main');
            if (main) {
                main.style.marginLeft = nav?.classList.contains('collapsed') ? '80px' : '240px';
            }
        });
    }

    function hideAllSections() {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('visible');
        });
    }

    function showSections(sectionNames: string[]) {
        sectionNames.forEach(name => {
            const section = document.querySelector(`section.${name}`);
            if (section) {
                section.classList.add('visible');
            }
        });
    }

    function setActiveLink(linkId: string) {
        // Remove active class from all links
        Object.values(sideItems).forEach(item => {
            if (item) {
                item.classList.remove('active');
            }
        });
        // Add active class to clicked link
        const activeItem = sideItems[linkId as keyof typeof sideItems];
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Handle navigation clicks
    Object.entries(sideItems).forEach(([key, item]) => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                hideAllSections();
                showSections(sectionGroups[key as keyof typeof sectionGroups]);
                setActiveLink(key);
            });
        }
    });

    // Initialize with home section
    hideAllSections();
    showSections(sectionGroups.home);
    setActiveLink('home');

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/login';
        });
    }
} 