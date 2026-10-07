document.addEventListener('DOMContentLoaded', () => {
    // --- Basic Inputs ---
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const linkedinInput = document.getElementById('linkedin');
    const githubInput = document.getElementById('github');

    // Skills Inputs
    const skillLangInput = document.getElementById('skill-languages');
    const skillFrameInput = document.getElementById('skill-frameworks');
    const skillToolsInput = document.getElementById('skill-tools');
    const skillCourseInput = document.getElementById('skill-coursework');

    // --- Preview Elements ---
    const previewName = document.getElementById('preview-name');
    const previewContact = document.getElementById('preview-contact');
    
    // Skills Preview
    const rowLang = document.getElementById('row-languages');
    const rowFrame = document.getElementById('row-frameworks');
    const rowTools = document.getElementById('row-tools');
    const rowCourse = document.getElementById('row-coursework');
    const prevLang = document.getElementById('preview-languages');
    const prevFrame = document.getElementById('preview-frameworks');
    const prevTools = document.getElementById('preview-tools');
    const prevCourse = document.getElementById('preview-coursework');

    // Containers
    const educationContainer = document.getElementById('education-container');
    const projectsContainer = document.getElementById('projects-container');
    const leadershipContainer = document.getElementById('leadership-container');
    const achievementsContainer = document.getElementById('achievements-container');

    const previewEducationList = document.getElementById('preview-education-list');
    const previewProjectsList = document.getElementById('preview-projects-list');
    const previewLeadershipList = document.getElementById('preview-leadership-list');
    const previewAchievementsList = document.getElementById('preview-achievements-list');

    // Buttons
    const btnAddEducation = document.getElementById('add-education');
    const btnAddProject = document.getElementById('add-project');
    const btnAddLeadership = document.getElementById('add-leadership');
    const btnAddAchievement = document.getElementById('add-achievement');
    const btnClear = document.getElementById('clear-form');
    const btnDownload = document.getElementById('download-pdf');
    
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    let counters = { edu: 0, proj: 0, lead: 0, ach: 0 };

    // --- Helpers ---
    const progressText = document.getElementById('progress-text');
    const updateProgress = () => {
        const inputs = document.querySelectorAll('input:not([type="button"]), textarea');
        let filled = 0;
        inputs.forEach(input => { if (input.value.trim() !== '') filled++; });
        const total = inputs.length || 1;
        const percent = Math.min(100, Math.round((filled / total) * 100));
        progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}%`;
    };

    const formatBullets = (text) => {
        if (!text) return '';
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return '';
        return `<div class="entry-description"><ul>${lines.map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul></div>`;
    };

    // --- Contact Render ---
    const renderContact = () => {
        const p = phoneInput.value.trim();
        const e = emailInput.value.trim();
        const l = linkedinInput.value.trim();
        const g = githubInput.value.trim();
        
        let parts = [];
        if (p) parts.push(p);
        if (e) parts.push(e);
        if (l) parts.push(l);
        if (g) parts.push(g);
        
        previewContact.innerHTML = parts.join(' | ');
        updateProgress();
    };

    nameInput.addEventListener('input', (e) => {
        previewName.textContent = e.target.value.trim() || 'Aashna Mittal';
        updateProgress();
    });

    [phoneInput, emailInput, linkedinInput, githubInput].forEach(inp => inp.addEventListener('input', renderContact));

    // --- Skills Render ---
    const attachSkillListener = (input, row, prevEl) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                prevEl.textContent = val;
                row.style.display = 'block';
            } else {
                row.style.display = 'none';
            }
            updateProgress();
        });
    };
    attachSkillListener(skillLangInput, rowLang, prevLang);
    attachSkillListener(skillFrameInput, rowFrame, prevFrame);
    attachSkillListener(skillToolsInput, rowTools, prevTools);
    attachSkillListener(skillCourseInput, rowCourse, prevCourse);


    // --- Dynamic Generators ---
    const createFormItem = (type, id, innerHTML) => {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.id = `${type}-form-${id}`;
        div.innerHTML = `<button type="button" class="btn-remove" onclick="removeDynamicItem('${type}', ${id})"><i class="fa-solid fa-trash"></i></button>${innerHTML}`;
        return div;
    };

    const generators = {
        edu: (id) => createFormItem('edu', id, `
            <div class="input-row">
                <div class="input-group"><label>Institution</label><input type="text" class="edu-inst" data-id="${id}" placeholder="Thapar Institute..."></div>
                <div class="input-group"><label>Location</label><input type="text" class="edu-loc" data-id="${id}" placeholder="Patiala, Punjab"></div>
            </div>
            <div class="input-row">
                <div class="input-group"><label>Degree & Major</label><input type="text" class="edu-deg" data-id="${id}" placeholder="B.Tech, Electronics..."></div>
                <div class="input-group"><label>CGPA / Percent</label><input type="text" class="edu-gpa" data-id="${id}" placeholder="CGPA: 8.63"></div>
            </div>
            <div class="input-group"><label>Dates</label><input type="text" class="edu-date" data-id="${id}" placeholder="2024 - 2028"></div>
        `),
        proj: (id) => createFormItem('proj', id, `
            <div class="input-row">
                <div class="input-group"><label>Project Name</label><input type="text" class="proj-name" data-id="${id}" placeholder="User Friction Platform"></div>
                <div class="input-group"><label>Link</label><input type="text" class="proj-link" data-id="${id}" placeholder="GitHub"></div>
            </div>
            <div class="input-group"><label>Tech Stack</label><input type="text" class="proj-tech" data-id="${id}" placeholder="Python, MySQL..."></div>
            <div class="input-group"><label>Description (One bullet per line)</label><textarea class="proj-desc" data-id="${id}" rows="3" placeholder="- Engineered a machine learning..."></textarea></div>
        `),
        lead: (id) => createFormItem('lead', id, `
            <div class="input-row">
                <div class="input-group"><label>Organization</label><input type="text" class="lead-org" data-id="${id}" placeholder="ACM Student Chapter"></div>
                <div class="input-group"><label>Dates</label><input type="text" class="lead-date" data-id="${id}" placeholder="Aug 2025 - Present"></div>
            </div>
            <div class="input-group"><label>Role</label><input type="text" class="lead-role" data-id="${id}" placeholder="Core Member"></div>
            <div class="input-group"><label>Description (One bullet per line)</label><textarea class="lead-desc" data-id="${id}" rows="3" placeholder="- Planned and executed..."></textarea></div>
        `),
        ach: (id) => createFormItem('ach', id, `
            <div class="input-group"><label>Title / Event</label><input type="text" class="ach-title" data-id="${id}" placeholder="National Finalist - IIT Roorkee E-Summit 2026"></div>
            <div class="input-group"><label>Description</label><textarea class="ach-desc" data-id="${id}" rows="2" placeholder="Ranked in Top 10 of 300+ teams..."></textarea></div>
        `)
    };

    // --- Render Logic ---
    const renderPreview = (type) => {
        let html = '';
        let items, previewEl, placeholder;

        if (type === 'edu') {
            items = document.querySelectorAll('.edu-inst');
            previewEl = previewEducationList;
            placeholder = '<p class="placeholder-text">Add education details.</p>';
            items.forEach(el => {
                const id = el.getAttribute('data-id');
                const inst = el.value || 'Institution Name';
                const loc = document.querySelector(`.edu-loc[data-id="${id}"]`).value || '';
                const deg = document.querySelector(`.edu-deg[data-id="${id}"]`).value || 'Degree';
                const gpa = document.querySelector(`.edu-gpa[data-id="${id}"]`).value || '';
                const date = document.querySelector(`.edu-date[data-id="${id}"]`).value || '';
                
                html += `
                <div style="margin-bottom: 8px;">
                    <div class="entry-header">
                        <span class="entry-title">${inst}</span>
                        <span class="entry-right">${loc}</span>
                    </div>
                    <div class="entry-subtitle">
                        <span>${deg}${gpa ? ` | ${gpa}` : ''}</span>
                        <span class="entry-subtitle-right">${date}</span>
                    </div>
                </div>`;
            });
        } 
        else if (type === 'proj') {
            items = document.querySelectorAll('.proj-name');
            previewEl = previewProjectsList;
            placeholder = '<p class="placeholder-text">Add projects.</p>';
            items.forEach(el => {
                const id = el.getAttribute('data-id');
                const name = el.value || 'Project Name';
                const tech = document.querySelector(`.proj-tech[data-id="${id}"]`).value || '';
                const link = document.querySelector(`.proj-link[data-id="${id}"]`).value || '';
                const desc = document.querySelector(`.proj-desc[data-id="${id}"]`).value || '';
                
                html += `
                <div style="margin-bottom: 10px;">
                    <div class="entry-header">
                        <span class="entry-title">${name}${tech ? ` <span style="font-weight:normal;">|</span> <span style="font-weight:normal; font-style:italic;">${tech}</span>` : ''}</span>
                        <span class="entry-right" style="text-decoration:underline;">${link}</span>
                    </div>
                    ${formatBullets(desc)}
                </div>`;
            });
        }
        else if (type === 'lead') {
            items = document.querySelectorAll('.lead-org');
            previewEl = previewLeadershipList;
            placeholder = '<p class="placeholder-text">Add leadership experience.</p>';
            items.forEach(el => {
                const id = el.getAttribute('data-id');
                const org = el.value || 'Organization Name';
                const date = document.querySelector(`.lead-date[data-id="${id}"]`).value || '';
                const role = document.querySelector(`.lead-role[data-id="${id}"]`).value || '';
                const desc = document.querySelector(`.lead-desc[data-id="${id}"]`).value || '';
                
                html += `
                <div style="margin-bottom: 10px;">
                    <div class="entry-header">
                        <span class="entry-title">${org}</span>
                        <span class="entry-right">${date}</span>
                    </div>
                    ${role ? `<div style="font-style:italic; margin-bottom: 2px;">${role}</div>` : ''}
                    ${formatBullets(desc)}
                </div>`;
            });
        }
        else if (type === 'ach') {
            items = document.querySelectorAll('.ach-title');
            previewEl = previewAchievementsList;
            placeholder = '<p class="placeholder-text">Add achievements.</p>';
            items.forEach(el => {
                const id = el.getAttribute('data-id');
                const title = el.value || 'Achievement';
                const desc = document.querySelector(`.ach-desc[data-id="${id}"]`).value || '';
                
                html += `
                <div class="achievement-item">
                    <span class="achievement-title">${title}</span>${desc ? ` – ${desc}` : ''}
                </div>`;
            });
        }

        if (items && items.length === 0) {
            previewEl.innerHTML = placeholder;
        } else if (previewEl) {
            previewEl.innerHTML = html;
        }
        updateProgress();
    };

    const attachDynamicListeners = (container, type) => {
        container.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => renderPreview(type));
        });
        updateProgress();
    };

    window.removeDynamicItem = (type, id) => {
        document.getElementById(`${type}-form-${id}`).remove();
        renderPreview(type);
    };

    const setupDynamicAdd = (btn, containerEl, type) => {
        btn.addEventListener('click', () => {
            counters[type]++;
            const item = generators[type](counters[type]);
            containerEl.appendChild(item);
            attachDynamicListeners(item, type);
            renderPreview(type);
        });
    };

    setupDynamicAdd(btnAddEducation, educationContainer, 'edu');
    setupDynamicAdd(btnAddProject, projectsContainer, 'proj');
    setupDynamicAdd(btnAddLeadership, leadershipContainer, 'lead');
    setupDynamicAdd(btnAddAchievement, achievementsContainer, 'ach');

    // Clear Form
    btnClear.addEventListener('click', () => {
        if(confirm('Are you sure you want to clear all data?')) {
            document.getElementById('resume-form').reset();
            educationContainer.innerHTML = '';
            projectsContainer.innerHTML = '';
            leadershipContainer.innerHTML = '';
            achievementsContainer.innerHTML = '';
            
            [nameInput, phoneInput, emailInput, linkedinInput, githubInput, 
             skillLangInput, skillFrameInput, skillToolsInput, skillCourseInput].forEach(inp => inp.dispatchEvent(new Event('input')));
             
            ['edu', 'proj', 'lead', 'ach'].forEach(type => renderPreview(type));
            progressBar.style.width = '0%';
        }
    });

    // Download PDF
    btnDownload.addEventListener('click', () => {
        const element = document.getElementById('resume-preview');
        
        const opt = {
            margin:       0,
            filename:     `${nameInput.value.trim() || 'Resume'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const originalText = btnDownload.innerHTML;
        btnDownload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        btnDownload.disabled = true;

        html2pdf().set(opt).from(element).save().then(() => {
            btnDownload.innerHTML = originalText;
            btnDownload.disabled = false;
        }).catch(err => {
            console.error(err);
            btnDownload.innerHTML = originalText;
            btnDownload.disabled = false;
            alert('Error generating PDF.');
        });
    });
    
    // Init Progress
    updateProgress();
});
