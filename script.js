/* =========================================================
   نظام مدارس الأمل الحديثة - الملف البرمجي الرئيسي
   جميع الحقوق محفوظة © 2026
   ========================================================= */

'use strict';

// ========================================================
// 1. البيانات الافتراضية
// ========================================================
const defaultStudents = [
    { id: '2026401', name: 'أحمد محمد علي', grade: 'الرابع الأساسي' },
    { id: '2026402', name: 'سارة خالد عمر', grade: 'الرابع الأساسي' },
    { id: '2026501', name: 'يوسف إبراهيم حسن', grade: 'الخامس الأساسي' },
    { id: '2026601', name: 'فاطمة عبدالله سعيد', grade: 'السادس الأساسي' },
    { id: '2026701', name: 'عبدالله صالح ناجي', grade: 'السابع الأساسي' },
    { id: '2026801', name: 'مريم عادل أحمد', grade: 'الثامن الأساسي' },
    { id: '2026901', name: 'علي حسين الكثيري', grade: 'التاسع الأساسي' }
];

const defaultTeachers = [
    { id: 't1', name: 'أستاذ خالد', username: 'khaled', password: '123', subject: 'رياضيات', leadClass: 'الرابع الأساسي' },
    { id: 't2', name: 'أستاذة منى', username: 'mona', password: '123', subject: 'لغة عربية', leadClass: 'الخامس الأساسي' },
    { id: 't3', name: 'أستاذ أحمد', username: 'ahmed', password: '123', subject: 'علوم', leadClass: 'السادس الأساسي' },
    { id: 't4', name: 'أستاذة فاطمة', username: 'fatima', password: '123', subject: 'لغة إنجليزية', leadClass: 'السابع الأساسي' },
    { id: 't5', name: 'أستاذ سامي', username: 'sami', password: '123', subject: 'دراسات اجتماعية', leadClass: 'الثامن الأساسي' },
    { id: 't6', name: 'أستاذ صالح', username: 'saleh', password: '123', subject: 'تربية إسلامية', leadClass: 'التاسع الأساسي' }
];

const defaultGradesClasses = [
    'الرابع الأساسي', 'الخامس الأساسي', 'السادس الأساسي',
    'السابع الأساسي', 'الثامن الأساسي', 'التاسع الأساسي'
];

// قائمة المواد الافتراضية
const defaultSubjects = [
    'رياضيات',
    'لغة عربية',
    'علوم',
    'لغة إنجليزية',
    'دراسات اجتماعية',
    'تربية إسلامية'
];

// ========================================================
// 2. تحميل البيانات
// ========================================================
function loadFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.warn('خطأ في قراءة ' + key, e);
        return fallback;
    }
}

let schoolGrades = loadFromStorage('amal_school_grades_list', defaultGradesClasses);
let students = loadFromStorage('amal_school_students', defaultStudents);
let teachers = loadFromStorage('amal_school_teachers', defaultTeachers);
let subjects = loadFromStorage('amal_school_subjects', defaultSubjects);
let gradesData = loadFromStorage('amal_school_grades', {});
let gradeSchemas = loadFromStorage('amal_school_schemas', {});
let complaints = loadFromStorage('amal_school_complaints', []);
let schoolLogo = '';
try { schoolLogo = localStorage.getItem('amal_school_logo') || ''; } catch (e) {}
let currentSession = loadFromStorage('amal_school_session', null);

// حماية ضد الدخول المتكرر السريع
let isLoggingIn = false;

function saveToLocalStorage() {
    try {
        localStorage.setItem('amal_school_grades_list', JSON.stringify(schoolGrades));
        localStorage.setItem('amal_school_students', JSON.stringify(students));
        localStorage.setItem('amal_school_teachers', JSON.stringify(teachers));
        localStorage.setItem('amal_school_subjects', JSON.stringify(subjects));
        localStorage.setItem('amal_school_grades', JSON.stringify(gradesData));
        localStorage.setItem('amal_school_schemas', JSON.stringify(gradeSchemas));
        localStorage.setItem('amal_school_complaints', JSON.stringify(complaints));
        localStorage.setItem('amal_school_logo', schoolLogo);
        localStorage.setItem('amal_school_session', JSON.stringify(currentSession));
    } catch (e) { console.warn('تعذر الحفظ', e); }
}

// ========================================================
// 3. أدوات مساعدة عامة
// ========================================================
window.showToast = function (message, type) {
    type = type || 'success';
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const iconEl = document.getElementById('toastIcon');
    if (!toast) return;
    msgEl.textContent = message;
    if (type === 'error') {
        iconEl.className = 'fa-solid fa-circle-exclamation text-red-400 text-lg';
        toast.className = 'fixed bottom-6 left-6 z-50 bg-red-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-3 fade-in';
    } else {
        iconEl.className = 'fa-solid fa-check-circle text-emerald-400 text-lg';
        toast.className = 'fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-3 fade-in';
    }
    toast.classList.remove('hidden');
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () { toast.classList.add('hidden'); }, 3000);
};

function applySchoolLogo() {
    const defaultIcon = document.getElementById('defaultLogoIcon');
    const customImg = document.getElementById('customLogoImg');
    const settingsIcon = document.getElementById('settingsPreviewIcon');
    const settingsImg = document.getElementById('settingsPreviewImg');
    if (schoolLogo) {
        if (defaultIcon) defaultIcon.classList.add('hidden');
        if (customImg) { customImg.src = schoolLogo; customImg.classList.remove('hidden'); }
        if (settingsIcon) settingsIcon.classList.add('hidden');
        if (settingsImg) { settingsImg.src = schoolLogo; settingsImg.classList.remove('hidden'); }
    } else {
        if (defaultIcon) defaultIcon.classList.remove('hidden');
        if (customImg) customImg.classList.add('hidden');
        if (settingsIcon) settingsIcon.classList.remove('hidden');
        if (settingsImg) settingsImg.classList.add('hidden');
    }
}

window.handleLogoUpload = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        schoolLogo = event.target.result;
        saveToLocalStorage();
        applySchoolLogo();
        showToast('تم تحديث شعار المدرسة بنجاح');
    };
    reader.readAsDataURL(file);
};

window.removeSchoolLogo = function () {
    schoolLogo = '';
    saveToLocalStorage();
    applySchoolLogo();
    showToast('تمت استعادة الشعار الافتراضي');
};

// ========================================================
// 4. نظام تسجيل الدخول (مع إصلاحات)
// ========================================================
window.showLoginModal = function (role) {
    document.getElementById('loginView').classList.add('hidden');
    const authSection = document.getElementById('authFormSection');
    authSection.classList.remove('hidden');
    const titleEl = document.getElementById('authTitle');
    const contentEl = document.getElementById('authFormContent');

    if (role === 'admin') {
        titleEl.textContent = 'تسجيل دخول إدارة المدرسة';
        contentEl.innerHTML =
            '<form onsubmit="handleLogin(event, \'admin\')" class="space-y-4" autocomplete="off">' +
            '<div><label class="block text-xs font-semibold text-slate-600 mb-1">اسم المستخدم</label>' +
            '<input type="text" id="loginUsername" required autocomplete="off" name="admin_user_' + Date.now() + '" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"></div>' +
            '<div><label class="block text-xs font-semibold text-slate-600 mb-1">كلمة المرور</label>' +
            '<input type="password" id="loginPassword" required autocomplete="new-password" name="admin_pass_' + Date.now() + '" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"></div>' +
            '<button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow transition">دخول الإدارة</button></form>';
    } else if (role === 'teacher') {
        titleEl.textContent = 'تسجيل دخول المعلمين / رواد الفصول';
        contentEl.innerHTML =
            '<form onsubmit="handleLogin(event, \'teacher\')" class="space-y-4" autocomplete="off">' +
            '<div><label class="block text-xs font-semibold text-slate-600 mb-1">اسم المستخدم</label>' +
            '<input type="text" id="loginUsername" required autocomplete="off" name="teacher_user_' + Date.now() + '" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"></div>' +
            '<div><label class="block text-xs font-semibold text-slate-600 mb-1">كلمة المرور</label>' +
            '<input type="password" id="loginPassword" required autocomplete="new-password" name="teacher_pass_' + Date.now() + '" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"></div>' +
            '<button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow transition">دخول المعلم</button></form>';
    } else if (role === 'parent') {
        titleEl.textContent = 'بوابة أولياء الأمور (استعلام برقم التسجيل)';
        contentEl.innerHTML =
            '<form onsubmit="handleLogin(event, \'parent\')" class="space-y-4" autocomplete="off">' +
            '<div><label class="block text-xs font-semibold text-slate-600 mb-1">رقم تسجيل الطالب</label>' +
            '<input type="text" id="parentRegNo" required placeholder="مثال: 2026401" autocomplete="off" name="parent_reg_' + Date.now() + '" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"></div>' +
            '<button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow transition">استعلام وعرض الدرجات</button></form>';
    }
};

window.backToLoginChoice = function () {
    document.getElementById('authFormSection').classList.add('hidden');
    document.getElementById('loginView').classList.remove('hidden');
    const contentEl = document.getElementById('authFormContent');
    if (contentEl) contentEl.innerHTML = '';
};

window.handleLogin = function (e, role) {
    e.preventDefault();
    if (isLoggingIn) return; // منع النقر المتكرر

    // ✅ تحقق صريح من الحقول
    if (role === 'parent') {
        const regEl = document.getElementById('parentRegNo');
        if (!regEl || !regEl.value || !regEl.value.trim()) {
            showToast('الرجاء إدخال رقم التسجيل', 'error');
            return;
        }
    } else {
        const uEl = document.getElementById('loginUsername');
        const pEl = document.getElementById('loginPassword');
        if (!uEl || !uEl.value || !uEl.value.trim()) {
            showToast('الرجاء إدخال اسم المستخدم', 'error');
            return;
        }
        if (!pEl || !pEl.value || pEl.value.length === 0) {
            showToast('الرجاء إدخال كلمة المرور', 'error');
            return;
        }
    }

    isLoggingIn = true;

    if (role === 'admin') {
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value;
        if (u === 'admin' && p === 'admin123321') {
            currentSession = { role: 'admin', name: 'مدير النظام' };
            saveToLocalStorage();
            restoreSession();
            showToast('مرحباً بك يا مدير النظام');
        } else {
            showToast('اسم المستخدم أو كلمة المرور للإدارة غير صحيحة', 'error');
        }
    } else if (role === 'teacher') {
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value;
        const teacher = teachers.find(function (t) { return t.username === u && t.password === p; });
        if (teacher) {
            currentSession = { role: 'teacher', id: teacher.id, name: teacher.name, subject: teacher.subject, leadClass: teacher.leadClass };
            saveToLocalStorage();
            restoreSession();
            showToast('أهلاً بك يا أستاذ ' + teacher.name);
        } else {
            showToast('بيانات الدخول غير صحيحة', 'error');
        }
    } else if (role === 'parent') {
        const regNo = document.getElementById('parentRegNo').value.trim();
        const student = students.find(function (s) { return s.id === regNo; });
        if (student) {
            currentSession = { role: 'parent', studentId: student.id, name: 'ولي أمر الطالب: ' + student.name };
            saveToLocalStorage();
            restoreSession();
            showToast('تم العثور على طالب: ' + student.name);
        } else {
            showToast('رقم التسجيل غير متوفر في سجلات المدرسة', 'error');
        }
    }

    setTimeout(function () { isLoggingIn = false; }, 800);
};

// ✅ logout فوري بدون إعادة تحميل الصفحة
window.logout = function () {
    try {
        currentSession = null;
        localStorage.removeItem('amal_school_session');
    } catch (e) { /* ignore */ }

    // إخفاء جميع اللوحات مباشرة
    ['adminDashboard', 'teacherDashboard', 'parentDashboard', 'userInfoHeader', 'authFormSection'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // إظهار صفحة الدخول
    const loginView = document.getElementById('loginView');
    if (loginView) loginView.classList.remove('hidden');

    // تنظيف أي بيانات مدخلة
    const contentEl = document.getElementById('authFormContent');
    if (contentEl) contentEl.innerHTML = '';
    document.querySelectorAll('input:not([type="file"])').forEach(function (inp) { inp.value = ''; });
    document.querySelectorAll('select').forEach(function (sel) { sel.selectedIndex = 0; });

    // مسح عنوان المستخدم في الأعلى
    const nameEl = document.getElementById('userNameDisplay');
    if (nameEl) nameEl.textContent = '';

    showToast('تم تسجيل الخروج بنجاح');
};

window.parentLogout = function () { window.logout(); };

// ========================================================
// 5. القوائم المنسدلة والجلسات
// ========================================================
function populateGradesDropdowns() {
    const selects = [
        document.getElementById('newStudentGrade'),
        document.getElementById('filterGradeSelect'),
        document.getElementById('newTeacherLeadClass'),
        document.getElementById('editTeacherLeadClass'),
        document.getElementById('teacherTargetGrade')
    ];
    selects.forEach(function (sel) {
        if (!sel) return;
        const currentVal = sel.value;
        let optionsHTML = '';
        if (sel.id === 'filterGradeSelect') optionsHTML = '<option value="all">كل الصفوف والفصول</option>';
        else if (sel.id === 'newTeacherLeadClass' || sel.id === 'editTeacherLeadClass') optionsHTML = '<option value="">-- ليس رائد فصل --</option>';
        schoolGrades.forEach(function (g) {
            optionsHTML += '<option value="' + g + '">' + g + '</option>';
        });
        sel.innerHTML = optionsHTML;
        if (currentVal) sel.value = currentVal;
    });
}

// ✅ تعبئة قوائم المواد من قائمة subjects
function populateSubjectDropdowns() {
    const selects = [
        document.getElementById('newTeacherSubject'),
        document.getElementById('editTeacherSubject')
    ];
    selects.forEach(function (sel) {
        if (!sel) return;
        const prev = sel.value;
        let html = '<option value="">-- اختر المادة --</option>';
        subjects.forEach(function (s) {
            html += '<option value="' + s + '">' + s + '</option>';
        });
        sel.innerHTML = html;
        if (prev && subjects.indexOf(prev) !== -1) sel.value = prev;
    });
}

function restoreSession() {
    if (!currentSession) return;
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('authFormSection').classList.add('hidden');
    document.getElementById('userInfoHeader').classList.remove('hidden');
    document.getElementById('userNameDisplay').textContent = currentSession.name;
    populateGradesDropdowns();
    populateSubjectDropdowns();

    if (currentSession.role === 'admin') {
        document.getElementById('adminDashboard').classList.remove('hidden');
        setupAdminGradesTab();
        renderStudentsTable();
        renderTeachersTable();
        renderAdminGradesList();
        renderAdminSubjectsList();
        populateAdminSchemaSubjects();
        populateAdminGradesSelectors();
        updateAdminComplaintBadgeCount();
    } else if (currentSession.role === 'teacher') {
        document.getElementById('teacherDashboard').classList.remove('hidden');
        document.getElementById('teacherWelcomeTitle').textContent = 'لوحة تحكم الأستاذ: ' + currentSession.name;
        document.getElementById('currentTeacherSubjectSpan').textContent = currentSession.subject;
        document.getElementById('teacherTargetGrade').value = currentSession.leadClass || schoolGrades[0];
        if (currentSession.leadClass) {
            document.getElementById('classLeaderBadge').classList.remove('hidden');
            document.getElementById('leaderClassSpan').textContent = currentSession.leadClass;
            document.getElementById('leaderClassTitleSpan').textContent = currentSession.leadClass;
            document.getElementById('teacherTabClassStudentsBtn').classList.remove('hidden');
            document.getElementById('teacherTabParentComplaintsBtn').classList.remove('hidden');
            updateTeacherComplaintBadgeCount();
        } else {
            document.getElementById('classLeaderBadge').classList.add('hidden');
            document.getElementById('teacherTabClassStudentsBtn').classList.add('hidden');
            document.getElementById('teacherTabParentComplaintsBtn').classList.add('hidden');
        }
        loadTeacherStudentsTable();
        populateParentTargetSelect();
    } else if (currentSession.role === 'parent') {
        document.getElementById('parentDashboard').classList.remove('hidden');
        loadParentData();
    }
}

// ========================================================
// 6. لوحة الإدارة - التنقل بين التبويبات
// ========================================================
window.switchAdminTab = function (tab) {
    // دمج التبويب الديناميكي ضمن القائمة
    setupAdminGradesTab();

    const map = {
        students:      { btn: 'adminTabStudentsBtn',         panel: 'adminStudentsPanel',         active: 'bg-indigo-600' },
        teachers:      { btn: 'adminTabTeachersBtn',         panel: 'adminTeachersPanel',         active: 'bg-emerald-600' },
        grades_config: { btn: 'adminTabGradesConfigBtn',     panel: 'adminGradesConfigPanel',     active: 'bg-indigo-600' },
        subjects:      { btn: 'adminTabSubjectsBtn',         panel: 'adminSubjectsPanel',         active: 'bg-emerald-600' },
        grade_schemas: { btn: 'adminTabGradeSchemasBtn',     panel: 'adminGradeSchemasPanel',     active: 'bg-emerald-600' },
        complaints:    { btn: 'adminTabComplaintsBtn',       panel: 'adminComplaintsPanel',       active: 'bg-indigo-600' },
        settings:      { btn: 'adminTabSettingsBtn',         panel: 'adminSettingsPanel',         active: 'bg-indigo-600' },
        student_grades:{ btn: 'adminTabStudentGradesBtn',    panel: 'adminStudentGradesPanel',    active: 'bg-emerald-600' }
    };

    Object.keys(map).forEach(function (key) {
        const btn = document.getElementById(map[key].btn);
        const panel = document.getElementById(map[key].panel);
        if (btn) btn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
        if (panel) panel.classList.add('hidden');
    });

    if (map[tab]) {
        const btn = document.getElementById(map[tab].btn);
        const panel = document.getElementById(map[tab].panel);
        if (btn) btn.className = 'px-4 py-2 rounded-xl text-sm font-bold ' + map[tab].active + ' text-white transition';
        if (panel) panel.classList.remove('hidden');
    }

    if (tab === 'students') renderStudentsTable();
    else if (tab === 'teachers') renderTeachersTable();
    else if (tab === 'grades_config') renderAdminGradesList();
    else if (tab === 'subjects') renderAdminSubjectsList();
    else if (tab === 'grade_schemas') populateAdminSchemaSubjects();
    else if (tab === 'complaints') renderAdminComplaints();
    else if (tab === 'student_grades') { populateAdminGradesSelectors(); loadAdminStudentGradesTable(); }
};

// ========================================================
// 7. إدارة الطلاب
// ========================================================
window.handleAddStudent = function (e) {
    e.preventDefault();
    const name = document.getElementById('newStudentName').value.trim();
    const id = document.getElementById('newStudentRegNo').value.trim();
    const grade = document.getElementById('newStudentGrade').value;
    if (students.some(function (s) { return s.id === id; })) {
        showToast('رقم التسجيل مستخدم مسبقاً!', 'error');
        return;
    }
    students.push({ id: id, name: name, grade: grade });
    saveToLocalStorage();
    renderStudentsTable();
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentRegNo').value = '';
    showToast('تم إضافة الطالب بنجاح');
};

function renderStudentsTable() {
    const tbody = document.getElementById('adminStudentsTableBody');
    const filterGrade = document.getElementById('filterGradeSelect').value;
    tbody.innerHTML = '';
    const filtered = filterGrade === 'all' ? students : students.filter(function (s) { return s.grade === filterGrade; });
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400">لا يوجد طلاب مسجلين</td></tr>';
        return;
    }
    filtered.forEach(function (s) {
        tbody.innerHTML += '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3 font-mono font-bold text-indigo-700">' + s.id + '</td>' +
            '<td class="p-3 font-semibold text-slate-800">' + s.name + '</td>' +
            '<td class="p-3 text-slate-600">' + s.grade + '</td>' +
            '<td class="p-3 text-center"><button onclick="deleteStudent(\'' + s.id + '\')" class="text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-trash"></i> حذف</button></td></tr>';
    });
}

window.deleteStudent = function (id) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟')) {
        students = students.filter(function (s) { return s.id !== id; });
        saveToLocalStorage();
        renderStudentsTable();
        showToast('تم حذف الطالب بنجاح');
    }
};

// ========================================================
// 8. إدارة المعلمين
// ========================================================
window.handleAddTeacher = function (e) {
    e.preventDefault();
    const name = document.getElementById('newTeacherName').value.trim();
    const username = document.getElementById('newTeacherUsername').value.trim();
    const password = document.getElementById('newTeacherPassword').value;
    const subject = document.getElementById('newTeacherSubject').value;
    const leadClass = document.getElementById('newTeacherLeadClass').value;
    if (!subject) { showToast('اختر مادة المعلم', 'error'); return; }
    if (teachers.some(function (t) { return t.username === username; })) {
        showToast('اسم المستخدم مستخدم مسبقاً!', 'error');
        return;
    }
    teachers.push({ id: 't_' + Date.now(), name: name, username: username, password: password, subject: subject, leadClass: leadClass });
    saveToLocalStorage();
    renderTeachersTable();
    document.getElementById('addTeacherForm').reset();
    populateSubjectDropdowns();
    showToast('تم إضافة المعلم بنجاح');
};

function renderTeachersTable() {
    const tbody = document.getElementById('adminTeachersTableBody');
    tbody.innerHTML = '';
    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400">لا يوجد معلمين مسجلين</td></tr>';
        return;
    }
    teachers.forEach(function (t) {
        const leadDisplay = t.leadClass
            ? '<span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">' + t.leadClass + '</span>'
            : '<span class="text-slate-400">لا يوجد</span>';
        tbody.innerHTML += '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3"><div class="font-bold text-slate-800">' + t.name + '</div><div class="text-xs text-emerald-600">مادة: ' + t.subject + '</div></td>' +
            '<td class="p-3 font-mono text-xs"><div>مستخدم: <strong>' + t.username + '</strong></div><div>مرور: <strong>' + t.password + '</strong></div></td>' +
            '<td class="p-3 text-xs">' + leadDisplay + '</td>' +
            '<td class="p-3 text-center space-x-1 space-x-reverse">' +
            '<button onclick="openEditTeacherModal(\'' + t.id + '\')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-pen"></i> تعديل</button> ' +
            '<button onclick="deleteTeacher(\'' + t.id + '\')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-trash"></i> حذف</button></td></tr>';
    });
}

window.openEditTeacherModal = function (id) {
    const t = teachers.find(function (item) { return item.id === id; });
    if (!t) return;
    document.getElementById('editTeacherId').value = t.id;
    document.getElementById('editTeacherName').value = t.name;
    document.getElementById('editTeacherUsername').value = t.username;
    document.getElementById('editTeacherPassword').value = t.password;

    // Subject select
    const subSel = document.getElementById('editTeacherSubject');
    let subOpts = '<option value="">-- اختر المادة --</option>';
    subjects.forEach(function (s) { subOpts += '<option value="' + s + '">' + s + '</option>'; });
    subSel.innerHTML = subOpts;
    subSel.value = t.subject;

    const sel = document.getElementById('editTeacherLeadClass');
    let opts = '<option value="">-- ليس رائد فصل --</option>';
    schoolGrades.forEach(function (g) { opts += '<option value="' + g + '">' + g + '</option>'; });
    sel.innerHTML = opts;
    sel.value = t.leadClass || '';
    document.getElementById('editTeacherModal').classList.remove('hidden');
};

window.closeEditTeacherModal = function () {
    document.getElementById('editTeacherModal').classList.add('hidden');
};

window.handleUpdateTeacher = function (e) {
    e.preventDefault();
    const id = document.getElementById('editTeacherId').value;
    const name = document.getElementById('editTeacherName').value;
    const username = document.getElementById('editTeacherUsername').value.trim();
    const password = document.getElementById('editTeacherPassword').value;
    const subject = document.getElementById('editTeacherSubject').value;
    const leadClass = document.getElementById('editTeacherLeadClass').value;
    if (teachers.some(function (t) { return t.username === username && t.id !== id; })) {
        showToast('اسم المستخدم مستخدم من قبل معلم آخر!', 'error');
        return;
    }
    const t = teachers.find(function (item) { return item.id === id; });
    if (t) {
        t.name = name; t.username = username; t.password = password;
        t.subject = subject; t.leadClass = leadClass;
        saveToLocalStorage();
        renderTeachersTable();
        closeEditTeacherModal();
        showToast('تم تحديث المعلم بنجاح');
    }
};

window.deleteTeacher = function (id) {
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
        teachers = teachers.filter(function (t) { return t.id !== id; });
        saveToLocalStorage();
        renderTeachersTable();
        showToast('تم حذف المعلم بنجاح');
    }
};

// ========================================================
// 9. إدارة الفصول
// ========================================================
window.handleAddGradeClass = function (e) {
    e.preventDefault();
    const className = document.getElementById('newGradeClassName').value.trim();
    if (!className) return;
    if (schoolGrades.indexOf(className) !== -1) {
        showToast('هذا الفصل موجود مسبقاً!', 'error');
        return;
    }
    schoolGrades.push(className);
    saveToLocalStorage();
    populateGradesDropdowns();
    renderAdminGradesList();
    document.getElementById('newGradeClassName').value = '';
    showToast('تم إضافة الفصل بنجاح');
};

function renderAdminGradesList() {
    const container = document.getElementById('adminGradesListContainer');
    if (!container) return;
    container.innerHTML = '';
    if (schoolGrades.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-2">لا توجد فصول مسجلة</p>';
        return;
    }
    schoolGrades.forEach(function (g) {
        const cnt = students.filter(function (s) { return s.grade === g; }).length;
        const safeG = g.replace(/'/g, "\\'");
        container.innerHTML +=
            '<div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">' +
                '<div class="flex items-center gap-3">' +
                    '<div class="bg-indigo-100 text-indigo-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold"><i class="fa-solid fa-school"></i></div>' +
                    '<div><div class="font-bold text-slate-800 text-sm">' + g + '</div>' +
                    '<div class="text-xs text-slate-500">عدد الطلاب: ' + cnt + '</div></div>' +
                '</div>' +
                '<div class="flex gap-1">' +
                    '<button onclick="openEditGradeClassModal(\'' + safeG + '\')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-pen"></i> تعديل</button>' +
                    '<button onclick="deleteGradeClass(\'' + safeG + '\')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-trash"></i> حذف</button>' +
                '</div>' +
            '</div>';
    });
}

window.openEditGradeClassModal = function (oldName) {
    document.getElementById('editGradeClassOldName').value = oldName;
    document.getElementById('editGradeClassNewName').value = oldName;
    document.getElementById('editGradeClassModal').classList.remove('hidden');
};

window.closeEditGradeClassModal = function () {
    document.getElementById('editGradeClassModal').classList.add('hidden');
};

window.handleUpdateGradeClass = function (e) {
    e.preventDefault();
    const oldName = document.getElementById('editGradeClassOldName').value;
    const newName = document.getElementById('editGradeClassNewName').value.trim();
    if (!newName) return;
    if (oldName === newName) { closeEditGradeClassModal(); return; }
    if (schoolGrades.indexOf(newName) !== -1) {
        showToast('يوجد فصل بنفس الاسم!', 'error');
        return;
    }
    const idx = schoolGrades.indexOf(oldName);
    if (idx !== -1) schoolGrades[idx] = newName;
    students.forEach(function (s) { if (s.grade === oldName) s.grade = newName; });
    teachers.forEach(function (t) { if (t.leadClass === oldName) t.leadClass = newName; });
    complaints.forEach(function (c) { if (c.grade === oldName) c.grade = newName; });
    if (currentSession && currentSession.role === 'teacher' && currentSession.leadClass === oldName) {
        currentSession.leadClass = newName;
    }
    saveToLocalStorage();
    populateGradesDropdowns();
    renderAdminGradesList();
    renderStudentsTable();
    renderTeachersTable();
    closeEditGradeClassModal();
    showToast('تم تعديل اسم الفصل بنجاح');
};

window.deleteGradeClass = function (className) {
    const cnt = students.filter(function (s) { return s.grade === className; }).length;
    const msg = cnt > 0
        ? 'يوجد ' + cnt + ' طالب في هذا الفصل. سيتم حذف الفصل فقط دون الطلاب. متابعة؟'
        : 'هل أنت متأكد من حذف هذا الفصل؟';
    if (!confirm(msg)) return;
    schoolGrades = schoolGrades.filter(function (g) { return g !== className; });
    saveToLocalStorage();
    populateGradesDropdowns();
    renderAdminGradesList();
    showToast('تم حذف الفصل بنجاح');
};

// ========================================================
// 10. ✅ إدارة المواد الدراسية (جديد)
// ========================================================
window.handleAddSubject = function (e) {
    e.preventDefault();
    const name = document.getElementById('newSubjectName').value.trim();
    if (!name) return;
    if (subjects.indexOf(name) !== -1) {
        showToast('هذه المادة موجودة مسبقاً!', 'error');
        return;
    }
    subjects.push(name);
    saveToLocalStorage();
    renderAdminSubjectsList();
    populateSubjectDropdowns();
    populateAdminSchemaSubjects();
    document.getElementById('newSubjectName').value = '';
    showToast('تم إضافة المادة بنجاح');
};

function renderAdminSubjectsList() {
    const container = document.getElementById('adminSubjectsListContainer');
    if (!container) return;
    container.innerHTML = '';
    if (subjects.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-2">لا توجد مواد مسجلة</p>';
        return;
    }
    subjects.forEach(function (s) {
        const teachersUsing = teachers.filter(function (t) { return t.subject === s; }).length;
        const safeS = s.replace(/'/g, "\\'");
        container.innerHTML +=
            '<div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">' +
                '<div class="flex items-center gap-3">' +
                    '<div class="bg-emerald-100 text-emerald-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold"><i class="fa-solid fa-book"></i></div>' +
                    '<div><div class="font-bold text-slate-800 text-sm">' + s + '</div>' +
                    '<div class="text-xs text-slate-500">عدد المعلمين: ' + teachersUsing + '</div></div>' +
                '</div>' +
                '<div class="flex gap-1">' +
                    '<button onclick="openEditSubjectModal(\'' + safeS + '\')" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-pen"></i> تعديل</button>' +
                    '<button onclick="deleteSubject(\'' + safeS + '\')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-trash"></i> حذف</button>' +
                '</div>' +
            '</div>';
    });
}

window.openEditSubjectModal = function (oldName) {
    document.getElementById('editSubjectOldName').value = oldName;
    document.getElementById('editSubjectNewName').value = oldName;
    document.getElementById('editSubjectModal').classList.remove('hidden');
};

window.closeEditSubjectModal = function () {
    document.getElementById('editSubjectModal').classList.add('hidden');
};

window.handleUpdateSubject = function (e) {
    e.preventDefault();
    const oldName = document.getElementById('editSubjectOldName').value;
    const newName = document.getElementById('editSubjectNewName').value.trim();
    if (!newName) return;
    if (oldName === newName) { closeEditSubjectModal(); return; }
    if (subjects.indexOf(newName) !== -1) {
        showToast('توجد مادة أخرى بنفس الاسم!', 'error');
        return;
    }
    // Update subjects list
    const idx = subjects.indexOf(oldName);
    if (idx !== -1) subjects[idx] = newName;
    // Update teachers
    teachers.forEach(function (t) { if (t.subject === oldName) t.subject = newName; });
    // Update schemas key
    if (gradeSchemas[oldName]) {
        gradeSchemas[newName] = gradeSchemas[oldName];
        delete gradeSchemas[oldName];
    }
    // Update gradesData: keys inside each student's record
    Object.keys(gradesData).forEach(function (sid) {
        if (gradesData[sid][oldName]) {
            gradesData[sid][newName] = gradesData[sid][oldName];
            delete gradesData[sid][oldName];
        }
    });
    // Update current session if teacher
    if (currentSession && currentSession.role === 'teacher' && currentSession.subject === oldName) {
        currentSession.subject = newName;
    }
    saveToLocalStorage();
    renderAdminSubjectsList();
    populateSubjectDropdowns();
    populateAdminSchemaSubjects();
    renderTeachersTable();
    closeEditSubjectModal();
    showToast('تم تعديل المادة بنجاح');
};

window.deleteSubject = function (name) {
    const usedBy = teachers.filter(function (t) { return t.subject === name; }).length;
    if (usedBy > 0) {
        showToast('لا يمكن حذف المادة، يوجد ' + usedBy + ' معلم مرتبط بها. غيّر مادتهم أولاً.', 'error');
        return;
    }
    if (!confirm('هل أنت متأكد من حذف مادة "' + name + '"؟')) return;
    subjects = subjects.filter(function (s) { return s !== name; });
    if (gradeSchemas[name]) delete gradeSchemas[name];
    saveToLocalStorage();
    renderAdminSubjectsList();
    populateSubjectDropdowns();
    populateAdminSchemaSubjects();
    showToast('تم حذف المادة بنجاح');
};

// ========================================================
// 11. توزيع الدرجات (Admin)
// ========================================================
function populateAdminSchemaSubjects() {
    const sel = document.getElementById('adminSchemaSubjectSelect');
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="">-- اختر المادة --</option>';
    subjects.forEach(function (s) {
        sel.innerHTML += '<option value="' + s + '">' + s + '</option>';
    });
    if (prev && subjects.indexOf(prev) !== -1) sel.value = prev;
    else if (subjects.length > 0) { sel.value = subjects[0]; loadAdminSchemaForSubject(); }
}

function getTeacherSchema(subject) {
    if (gradeSchemas[subject]) return gradeSchemas[subject];
    return [
        { name: 'حضور وغياب', max: 20 },
        { name: 'اختبار شهري', max: 40 },
        { name: 'سلوك', max: 20 },
        { name: 'مشاركة', max: 20 }
    ];
}

window.loadAdminSchemaForSubject = function () {
    const subject = document.getElementById('adminSchemaSubjectSelect').value;
    const container = document.getElementById('schemaAdminItemsContainer');
    container.innerHTML = '';
    if (!subject) return;
    const schema = getTeacherSchema(subject);
    schema.forEach(function (item) {
        container.innerHTML += '<div class="flex items-center gap-2 schema-row">' +
            '<input type="text" value="' + item.name + '" placeholder="اسم البند" class="flex-grow p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm schema-name">' +
            '<input type="number" min="1" max="100" value="' + item.max + '" placeholder="الدرجة القصوى" class="w-28 p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm schema-max font-bold text-center">' +
            '<button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700 px-2 py-1 text-xs"><i class="fa-solid fa-trash"></i></button></div>';
    });
};

window.addAdminSchemaItemRow = function () {
    const container = document.getElementById('schemaAdminItemsContainer');
    container.innerHTML += '<div class="flex items-center gap-2 schema-row">' +
        '<input type="text" value="" placeholder="اسم البند الجديد" class="flex-grow p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm schema-name">' +
        '<input type="number" min="1" max="100" value="10" placeholder="الدرجة القصوى" class="w-28 p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm schema-max font-bold text-center">' +
        '<button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700 px-2 py-1 text-xs"><i class="fa-solid fa-trash"></i></button></div>';
};

window.saveAdminGradeSchema = function () {
    const subject = document.getElementById('adminSchemaSubjectSelect').value;
    if (!subject) { showToast('اختر المادة أولاً', 'error'); return; }
    const rows = document.querySelectorAll('#schemaAdminItemsContainer .schema-row');
    let newSchema = []; let totalMax = 0;
    rows.forEach(function (row) {
        const name = row.querySelector('.schema-name').value.trim();
        const max = parseFloat(row.querySelector('.schema-max').value) || 0;
        if (name) { newSchema.push({ name: name, max: max }); totalMax += max; }
    });
    const warningEl = document.getElementById('adminSchemaTotalWarning');
    if (totalMax !== 100) {
        warningEl.textContent = 'خطأ: المجموع يجب أن يكون 100 تماماً (الحالي: ' + totalMax + ')';
        warningEl.classList.remove('hidden'); return;
    }
    warningEl.classList.add('hidden');
    gradeSchemas[subject] = newSchema;
    saveToLocalStorage();
    showToast('تم حفظ توزيع درجات مادة ' + subject);
};

// ========================================================
// 12. إدارة درجات الطلاب (Admin) - التبويب الديناميكي
// ========================================================
function setupAdminGradesTab() {
    if (document.getElementById('adminTabStudentGradesBtn')) return;
    const tabsContainer = document.getElementById('adminTabStudentsBtn').parentElement;

    const newBtn = document.createElement('button');
    newBtn.id = 'adminTabStudentGradesBtn';
    newBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
    newBtn.textContent = 'إدارة درجات الطلاب';
    newBtn.onclick = function () { switchAdminTab('student_grades'); };
    tabsContainer.appendChild(newBtn);

    const mainContainer = document.getElementById('adminDashboard');
    const newPanel = document.createElement('div');
    newPanel.id = 'adminStudentGradesPanel';
    newPanel.className = 'hidden space-y-6';
    newPanel.innerHTML =
        '<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">' +
            '<div><h3 class="font-bold text-slate-800 flex items-center gap-2"><i class="fa-solid fa-table-list text-indigo-600"></i> إدارة درجات الطلاب</h3>' +
            '<p class="text-xs text-slate-500">اطّلع على جميع الدرجات المُرسلة من المعلمين، مع إمكانية التعديل أو الحذف.</p></div>' +
            '<div class="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">' +
                '<div><label class="block text-xs font-semibold text-slate-600 mb-1">اختر المادة/المعلم</label>' +
                '<select id="adminGradesSubjectSelect" onchange="loadAdminStudentGradesTable()" class="p-2 bg-white border border-slate-200 rounded-xl text-sm"></select></div>' +
                '<div><label class="block text-xs font-semibold text-slate-600 mb-1">اختر الصف</label>' +
                '<select id="adminGradesClassSelect" onchange="loadAdminStudentGradesTable()" class="p-2 bg-white border border-slate-200 rounded-xl text-sm"></select></div>' +
            '</div>' +
            '<div class="overflow-x-auto"><table class="w-full text-right text-sm">' +
                '<thead id="adminStudentGradesTableHead" class="bg-slate-100 text-slate-600 text-xs uppercase"></thead>' +
                '<tbody id="adminStudentGradesTableBody" class="divide-y divide-slate-100"></tbody>' +
            '</table></div>' +
        '</div>';
    mainContainer.appendChild(newPanel);
}

function populateAdminGradesSelectors() {
    const teacherSel = document.getElementById('adminGradesSubjectSelect');
    const classSel = document.getElementById('adminGradesClassSelect');
    if (!teacherSel || !classSel) return;
    const prevT = teacherSel.value, prevC = classSel.value;
    teacherSel.innerHTML = '<option value="">-- اختر المادة/المعلم --</option>';
    teachers.forEach(function (t) {
        teacherSel.innerHTML += '<option value="' + t.id + '">' + t.subject + ' — ' + t.name + '</option>';
    });
    classSel.innerHTML = '<option value="">-- اختر الصف --</option>';
    schoolGrades.forEach(function (g) {
        classSel.innerHTML += '<option value="' + g + '">' + g + '</option>';
    });
    if (prevT) teacherSel.value = prevT;
    if (prevC) classSel.value = prevC;
}

window.loadAdminStudentGradesTable = function () {
    const teacherId = document.getElementById('adminGradesSubjectSelect').value;
    const grade = document.getElementById('adminGradesClassSelect').value;
    const thead = document.getElementById('adminStudentGradesTableHead');
    const tbody = document.getElementById('adminStudentGradesTableBody');
    thead.innerHTML = ''; tbody.innerHTML = '';

    if (!teacherId || !grade) {
        tbody.innerHTML = '<tr><td class="p-4 text-center text-slate-400">اختر المادة والصف</td></tr>';
        return;
    }
    const teacher = teachers.find(function (t) { return t.id === teacherId; });
    if (!teacher) return;
    const subject = teacher.subject;
    const schema = getTeacherSchema(subject);

    let headerHTML = '<tr><th class="p-3 rounded-r-xl">رقم التسجيل</th><th class="p-3">اسم الطالب</th>';
    schema.forEach(function (item) {
        headerHTML += '<th class="p-3 text-center">' + item.name + '<br><span class="text-[10px] text-slate-400 font-normal">من ' + item.max + '</span></th>';
    });
    headerHTML += '<th class="p-3 text-center">المجموع</th><th class="p-3">ملاحظات</th><th class="p-3 text-center">الحالة</th><th class="p-3 rounded-l-xl text-center">إجراءات</th></tr>';
    thead.innerHTML = headerHTML;

    const classStudents = students.filter(function (s) { return s.grade === grade; });
    if (classStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + (schema.length + 5) + '" class="p-4 text-center text-slate-400">لا يوجد طلاب</td></tr>';
        return;
    }

    classStudents.forEach(function (s) {
        const rec = (gradesData[s.id] && gradesData[s.id][subject]) || { parts: {}, note: '', submitted: false };
        if (!rec.parts) rec.parts = {};
        if (!rec.reductionReasons) rec.reductionReasons = {};

        let rowHTML = '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3 font-mono font-bold text-slate-600">' + s.id + '</td>' +
            '<td class="p-3 font-semibold text-slate-800">' + s.name + '</td>';

        let total = 0;
        schema.forEach(function (item) {
            const val = rec.parts[item.name] !== undefined ? rec.parts[item.name] : '';
            if (val !== '') total += parseFloat(val) || 0;
            const reason = rec.reductionReasons[item.name];
            const reasonHTML = reason
                ? '<div class="reduction-reason-display mt-1 text-right">سبب الخصم: ' + reason + '</div>'
                : '';
            rowHTML += '<td class="p-3 text-center">' +
                '<input type="number" min="0" max="' + item.max + '" value="' + val + '" ' +
                'onchange="adminUpdateGradePart(\'' + s.id + '\',\'' + subject + '\',\'' + item.name.replace(/'/g, "\\'") + '\',' + item.max + ',this)" ' +
                'class="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center focus:outline-none focus:border-indigo-600" placeholder="0">' +
                reasonHTML +
            '</td>';
        });

        rowHTML += '<td class="p-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/50" id="adminTotalCell_' + s.id + '_' + subject + '">' + total + ' / 100</td>' +
            '<td class="p-3"><input type="text" value="' + (rec.note || '') + '" onchange="adminUpdateGradeNote(\'' + s.id + '\',\'' + subject + '\',this.value)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600" placeholder="ملاحظة..."></td>' +
            '<td class="p-3 text-center">' + (rec.submitted ? '<span class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">مُسلَّمة</span>' : '<span class="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">مسودة</span>') + '</td>' +
            '<td class="p-3 text-center"><button onclick="adminDeleteGrade(\'' + s.id + '\',\'' + subject + '\')" class="text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition"><i class="fa-solid fa-trash"></i> حذف</button></td>' +
        '</tr>';
        tbody.innerHTML += rowHTML;
    });
};

window.adminUpdateGradePart = function (studentId, subject, partName, maxVal, inputEl) {
    let val = parseFloat(inputEl.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val > maxVal) { showToast('الدرجة القصوى ' + maxVal, 'error'); inputEl.value = maxVal; val = maxVal; }
    if (!gradesData[studentId]) gradesData[studentId] = {};
    if (!gradesData[studentId][subject]) gradesData[studentId][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
    if (!gradesData[studentId][subject].parts) gradesData[studentId][subject].parts = {};
    gradesData[studentId][subject].parts[partName] = val;
    saveToLocalStorage();
    let total = 0;
    const schema = getTeacherSchema(subject);
    schema.forEach(function (item) {
        const v = gradesData[studentId][subject].parts[item.name];
        if (v !== undefined && v !== '') total += parseFloat(v) || 0;
    });
    const cell = document.getElementById('adminTotalCell_' + studentId + '_' + subject);
    if (cell) cell.textContent = total + ' / 100';
    showToast('تم تحديث الدرجة');
};

window.adminUpdateGradeNote = function (studentId, subject, noteVal) {
    if (!gradesData[studentId]) gradesData[studentId] = {};
    if (!gradesData[studentId][subject]) gradesData[studentId][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
    gradesData[studentId][subject].note = noteVal;
    saveToLocalStorage();
    showToast('تم حفظ الملاحظة');
};

window.adminDeleteGrade = function (studentId, subject) {
    if (!confirm('حذف كامل درجات الطالب في هذه المادة؟')) return;
    if (gradesData[studentId] && gradesData[studentId][subject]) {
        delete gradesData[studentId][subject];
        saveToLocalStorage();
        loadAdminStudentGradesTable();
        showToast('تم الحذف');
    }
};

// ========================================================
// 13. الشكاوى (Admin)
// ========================================================
function updateAdminComplaintBadgeCount() {
    const el = document.getElementById('adminComplaintBadgeCount');
    if (!el) return;
    const count = complaints.filter(function (c) { return !c.reply; }).length;
    el.textContent = count;
}

function renderAdminComplaints() {
    const container = document.getElementById('adminComplaintsListContainer');
    if (!container) return;
    const filter = document.getElementById('adminComplaintFilter').value;
    container.innerHTML = '';
    let filtered = complaints.slice();
    if (filter === 'parent_to_teacher') filtered = filtered.filter(function (c) { return c.type === 'parent_to_teacher'; });
    else if (filter === 'teacher_to_parent') filtered = filtered.filter(function (c) { return c.type === 'teacher_to_parent'; });

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">لا توجد شكاوى</p>';
        return;
    }
    filtered.sort(function (a, b) { return (b.id > a.id) ? 1 : -1; });
    filtered.forEach(function (c) {
        const typeLabel = c.type === 'teacher_to_parent'
            ? '<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">من رائد الفصل → ولي الأمر</span>'
            : '<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">من ولي الأمر → رائد الفصل</span>';
        const fromName = c.type === 'teacher_to_parent' ? c.teacherName : c.studentName + ' (ولي الأمر)';
        const toName = c.type === 'teacher_to_parent' ? c.studentName + ' (ولي الأمر)' : c.teacherName;
        container.innerHTML +=
            '<div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">' +
                '<div class="flex justify-between items-start flex-wrap gap-2">' +
                    '<div class="space-y-1"><div class="flex items-center gap-2 flex-wrap">' +
                        '<h4 class="font-bold text-slate-800">' + c.title + '</h4>' + typeLabel +
                    '</div><p class="text-xs text-slate-500">من: <strong>' + fromName + '</strong> — إلى: <strong>' + toName + '</strong> — الطالب: <strong>' + c.studentName + '</strong> (' + c.grade + ')</p></div>' +
                    '<span class="text-[10px] text-slate-400">' + c.date + '</span>' +
                '</div>' +
                '<p class="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">' + c.text + '</p>' +
                (c.reply ? '<div class="bg-emerald-50 border border-emerald-200 p-3 rounded-lg"><span class="text-xs font-bold text-emerald-700">الرد:</span><p class="text-sm text-emerald-800 mt-0.5">' + c.reply + '</p></div>' : '') +
                '<div class="flex justify-end gap-2 pt-2 border-t border-slate-200">' +
                    '<button onclick="openAdminEditComplaintModal(\'' + c.id + '\')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-solid fa-pen"></i> تعديل</button>' +
                    '<button onclick="deleteAdminComplaint(\'' + c.id + '\')" class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-solid fa-trash"></i> حذف</button>' +
                '</div>' +
            '</div>';
    });
}

window.openAdminEditComplaintModal = function (id) {
    const c = complaints.find(function (x) { return x.id === id; });
    if (!c) return;
    document.getElementById('adminEditComplaintId').value = c.id;
    document.getElementById('adminEditComplaintTitle').value = c.title;
    document.getElementById('adminEditComplaintText').value = c.text;
    document.getElementById('adminEditComplaintReply').value = c.reply || '';
    document.getElementById('adminEditComplaintModal').classList.remove('hidden');
};

window.closeAdminEditComplaintModal = function () {
    document.getElementById('adminEditComplaintModal').classList.add('hidden');
};

window.handleAdminUpdateComplaint = function (e) {
    e.preventDefault();
    const id = document.getElementById('adminEditComplaintId').value;
    const title = document.getElementById('adminEditComplaintTitle').value.trim();
    const text = document.getElementById('adminEditComplaintText').value.trim();
    const reply = document.getElementById('adminEditComplaintReply').value.trim();
    const c = complaints.find(function (x) { return x.id === id; });
    if (c) {
        c.title = title; c.text = text; c.reply = reply;
        saveToLocalStorage();
        closeAdminEditComplaintModal();
        renderAdminComplaints();
        updateAdminComplaintBadgeCount();
        showToast('تم تعديل الشكوى');
    }
};

window.deleteAdminComplaint = function (id) {
    if (!confirm('حذف هذه الشكوى نهائياً؟')) return;
    complaints = complaints.filter(function (c) { return c.id !== id; });
    saveToLocalStorage();
    renderAdminComplaints();
    updateAdminComplaintBadgeCount();
    showToast('تم الحذف');
};

// ========================================================
// 14. لوحة المعلم
// ========================================================
window.switchTeacherTab = function (tab) {
    const gradesBtn = document.getElementById('teacherTabGradesBtn');
    const classStudentsBtn = document.getElementById('teacherTabClassStudentsBtn');
    const complaintsBtn = document.getElementById('teacherTabParentComplaintsBtn');
    const gradesPanel = document.getElementById('teacherGradesPanel');
    const classStudentsPanel = document.getElementById('teacherClassStudentsPanel');
    const complaintsPanel = document.getElementById('teacherParentComplaintsPanel');

    gradesBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
    if (classStudentsBtn) classStudentsBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
    if (complaintsBtn) complaintsBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
    gradesPanel.classList.add('hidden');
    if (classStudentsPanel) classStudentsPanel.classList.add('hidden');
    if (complaintsPanel) complaintsPanel.classList.add('hidden');

    if (tab === 'grades') {
        gradesBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white transition';
        gradesPanel.classList.remove('hidden');
        loadTeacherStudentsTable();
    } else if (tab === 'classStudents') {
        if (classStudentsBtn) classStudentsBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white transition';
        if (classStudentsPanel) classStudentsPanel.classList.remove('hidden');
        renderLeaderStudentsTable();
    } else if (tab === 'parentComplaints') {
        if (complaintsBtn) complaintsBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white transition';
        if (complaintsPanel) complaintsPanel.classList.remove('hidden');
        populateParentTargetSelect();
        renderTeacherParentComplaints();
    }
};

// إضافة طالب من المعلم
window.handleLeaderAddStudent = function (e) {
    e.preventDefault();
    const name = document.getElementById('leaderNewStudentName').value.trim();
    const regNo = document.getElementById('leaderNewStudentRegNo').value.trim();
    const grade = currentSession.leadClass;
    if (students.some(function (s) { return s.id === regNo; })) {
        showToast('رقم التسجيل مستخدم مسبقاً!', 'error'); return;
    }
    students.push({ id: regNo, name: name, grade: grade, addedByTeacher: true });
    saveToLocalStorage();
    renderLeaderStudentsTable();
    document.getElementById('leaderNewStudentName').value = '';
    document.getElementById('leaderNewStudentRegNo').value = '';
    showToast('تمت إضافة الطالب');
};

function renderLeaderStudentsTable() {
    const tbody = document.getElementById('leaderStudentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const myGrade = currentSession.leadClass;
    const myStudents = students.filter(function (s) { return s.grade === myGrade; });
    if (myStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-400">لا يوجد طلاب في فصلك</td></tr>';
        return;
    }
    myStudents.forEach(function (s) {
        tbody.innerHTML += '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3 font-mono font-bold text-emerald-700">' + s.id + '</td>' +
            '<td class="p-3 font-semibold text-slate-800">' + s.name + '</td>' +
            '<td class="p-3 text-center"><span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">مسجل</span></td></tr>';
    });
}

// ========================================================
// 15. جدول الدرجات للمعلم (مع سبب الخصم)
// ========================================================
function checkGradesSubmittedForClass(grade, subject) {
    const classStudents = students.filter(function (s) { return s.grade === grade; });
    if (classStudents.length === 0) return false;
    const rec = gradesData[classStudents[0].id] && gradesData[classStudents[0].id][subject];
    return rec && rec.submitted === true;
}

function loadTeacherStudentsTable() {
    const grade = document.getElementById('teacherTargetGrade').value;
    const subject = currentSession.subject;
    const schema = getTeacherSchema(subject);
    const isSubmitted = checkGradesSubmittedForClass(grade, subject);

    const lockNotice = document.getElementById('teacherGradesLockNotice');
    const submitBtn = document.getElementById('submitGradesBtn');
    if (isSubmitted) {
        lockNotice.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.className = 'px-4 py-2 bg-slate-300 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed flex items-center gap-1.5';
        submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> تم الإرسال';
    } else {
        lockNotice.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.className = 'px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-800 transition flex items-center gap-1.5';
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الدرجات للإدارة';
    }

    const thead = document.getElementById('teacherGradesTableHead');
    let headerHTML = '<tr><th class="p-3 rounded-r-xl">رقم التسجيل</th><th class="p-3">اسم الطالب</th>';
    schema.forEach(function (item) {
        headerHTML += '<th class="p-3 text-center">' + item.name + '<br><span class="text-[10px] text-slate-400 font-normal">من ' + item.max + '</span></th>';
    });
    headerHTML += '<th class="p-3 text-center">المجموع</th><th class="p-3 rounded-l-xl">ملاحظات</th></tr>';
    thead.innerHTML = headerHTML;

    const tbody = document.getElementById('teacherGradesTableBody');
    tbody.innerHTML = '';
    const gradeStudents = students.filter(function (s) { return s.grade === grade; });

    if (gradeStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + (schema.length + 3) + '" class="p-4 text-center text-slate-400">لا يوجد طلاب</td></tr>';
        return;
    }

    gradeStudents.forEach(function (s) {
        if (!gradesData[s.id]) gradesData[s.id] = {};
        if (!gradesData[s.id][subject]) gradesData[s.id][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
        const rec = gradesData[s.id][subject];
        if (!rec.parts) rec.parts = {};
        if (!rec.reductionReasons) rec.reductionReasons = {};

        let rowHTML = '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3 font-mono font-bold text-slate-600">' + s.id + '</td>' +
            '<td class="p-3 font-semibold text-slate-800">' + s.name + '</td>';

        let total = 0;
        schema.forEach(function (item) {
            const val = rec.parts[item.name] !== undefined ? rec.parts[item.name] : '';
            if (val !== '') total += parseFloat(val) || 0;
            const disabledAttr = isSubmitted ? 'disabled' : '';
            const bgClass = isSubmitted ? 'bg-slate-100 text-slate-500' : 'bg-slate-50';
            const reason = rec.reductionReasons[item.name];
            const reasonHTML = reason
                ? '<div class="reduction-reason-display mt-1 text-right">سبب الخصم: ' + reason + '</div>'
                : '';
            rowHTML += '<td class="p-3 text-center">' +
                '<input type="number" min="0" max="' + item.max + '" value="' + val + '" ' + disabledAttr + ' ' +
                'onchange="updateGradePart(\'' + s.id + '\',\'' + subject + '\',\'' + item.name.replace(/'/g, "\\'") + '\',' + item.max + ',this)" ' +
                'class="w-16 p-1.5 ' + bgClass + ' border border-slate-200 rounded-xl text-sm font-bold text-center focus:outline-none focus:border-emerald-600" placeholder="0">' +
                reasonHTML +
            '</td>';
        });

        const noteDisabled = isSubmitted ? 'disabled' : '';
        const noteBg = isSubmitted ? 'bg-slate-100 text-slate-500' : 'bg-slate-50';
        rowHTML += '<td class="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50" id="totalCell_' + s.id + '_' + subject + '">' + total + ' / 100</td>' +
            '<td class="p-3"><input type="text" value="' + (rec.note || '') + '" ' + noteDisabled + ' onchange="updateGradeNote(\'' + s.id + '\',\'' + subject + '\',this.value)" class="w-full p-2 ' + noteBg + ' border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" placeholder="ملاحظة عامة..." data-grade-note="' + s.id + '_' + subject + '"></td>' +
        '</tr>';
        tbody.innerHTML += rowHTML;
    });
}

// ✅ تحديث الدرجة مع طلب سبب الخصم عند تجاوز 6 درجات
window.updateGradePart = function (studentId, subject, partName, maxVal, inputEl) {
    const rec = (gradesData[studentId] && gradesData[studentId][subject]) || null;
    if (currentSession.role === 'teacher' && rec && rec.submitted) {
        showToast('الدرجات مرسلة، لا يمكن التعديل', 'error');
        inputEl.value = rec.parts ? (rec.parts[partName] !== undefined ? rec.parts[partName] : '') : '';
        return;
    }

    let newVal = parseFloat(inputEl.value);
    if (isNaN(newVal) || newVal < 0) newVal = 0;
    if (newVal > maxVal) {
        showToast('الدرجة القصوى ' + maxVal, 'error');
        inputEl.value = maxVal; newVal = maxVal;
    }

    if (!gradesData[studentId]) gradesData[studentId] = {};
    if (!gradesData[studentId][subject]) gradesData[studentId][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
    const record = gradesData[studentId][subject];
    if (!record.parts) record.parts = {};
    if (!record.reductionReasons) record.reductionReasons = {};

    const oldVal = record.parts[partName] !== undefined ? parseFloat(record.parts[partName]) : null;

    // قاعدة الـ6 درجات: إذا التخفيض أكثر من 6، اطلب سبباً
    if (currentSession.role === 'teacher' && oldVal !== null && (oldVal - newVal) > 6) {
        let reason = record.reductionReasons[partName] || '';
        if (!reason) {
            const prompt_val = window.prompt(
                'أنت على وشك تخفيض درجة الطالب في بند "' + partName + '" من ' + oldVal + ' إلى ' + newVal +
                ' (تخفيض ' + (oldVal - newVal) + ' درجات).\n\nيرجى كتابة سبب الخصم (إلزامي):',
                ''
            );
            if (!prompt_val || !prompt_val.trim()) {
                showToast('يجب كتابة سبب الخصم عند تخفيض أكثر من 6 درجات', 'error');
                inputEl.value = oldVal;
                return;
            }
            reason = prompt_val.trim();
            record.reductionReasons[partName] = reason;
            // أضف أيضاً للملاحظة العامة للتوضيح
            const noteAdd = 'سبب خصم بند "' + partName + '": ' + reason;
            record.note = record.note ? (record.note + ' | ' + noteAdd) : noteAdd;
            const noteInput = document.querySelector('[data-grade-note="' + studentId + '_' + subject + '"]');
            if (noteInput) noteInput.value = record.note;
        }
    }

    record.parts[partName] = newVal;
    saveToLocalStorage();

    let total = 0;
    const schema = getTeacherSchema(subject);
    schema.forEach(function (item) {
        const v = record.parts[item.name];
        if (v !== undefined && v !== '') total += parseFloat(v) || 0;
    });
    const totalCell = document.getElementById('totalCell_' + studentId + '_' + subject);
    if (totalCell) totalCell.textContent = total + ' / 100';

    // ✅ أعِد رسم الخلية لعرض سبب الخصم مباشرة
    if (record.reductionReasons[partName]) {
        const cell = inputEl.closest('td');
        if (cell) {
            let reasonEl = cell.querySelector('.reduction-reason-display');
            if (!reasonEl) {
                reasonEl = document.createElement('div');
                reasonEl.className = 'reduction-reason-display mt-1 text-right';
                cell.appendChild(reasonEl);
            }
            reasonEl.textContent = 'سبب الخصم: ' + record.reductionReasons[partName];
        }
    }

    showToast('تم حفظ الدرجة');
};

window.updateGradeNote = function (studentId, subject, noteVal) {
    const rec = (gradesData[studentId] && gradesData[studentId][subject]) || null;
    if (currentSession.role === 'teacher' && rec && rec.submitted) {
        showToast('الدرجات مرسلة، لا يمكن التعديل', 'error'); return;
    }
    if (!gradesData[studentId]) gradesData[studentId] = {};
    if (!gradesData[studentId][subject]) gradesData[studentId][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
    gradesData[studentId][subject].note = noteVal;
    saveToLocalStorage();
    showToast('تم حفظ الملاحظة');
};

window.submitTeacherGrades = function () {
    const grade = document.getElementById('teacherTargetGrade').value;
    const subject = currentSession.subject;
    const classStudents = students.filter(function (s) { return s.grade === grade; });
    if (classStudents.length === 0) {
        showToast('لا يوجد طلاب في هذا الصف', 'error'); return;
    }
    if (!confirm('إرسال الدرجات للإدارة؟ بعد الإرسال لن تتمكن من التعديل.')) return;

    classStudents.forEach(function (s) {
        if (!gradesData[s.id]) gradesData[s.id] = {};
        if (!gradesData[s.id][subject]) gradesData[s.id][subject] = { parts: {}, note: '', reductionReasons: {}, submitted: false };
        gradesData[s.id][subject].submitted = true;
        gradesData[s.id][subject].submittedAt = new Date().toISOString();
    });
    saveToLocalStorage();
    loadTeacherStudentsTable();
    showToast('تم إرسال الدرجات للإدارة');
};

// ========================================================
// 16. شكاوى المعلم مع أولياء الأمور
// ========================================================
function populateParentTargetSelect() {
    const sel = document.getElementById('teacherParentTargetStudent');
    if (!sel) return;
    const myGrade = currentSession.leadClass;
    if (!myGrade) { sel.innerHTML = ''; return; }
    const myStudents = students.filter(function (s) { return s.grade === myGrade; });
    sel.innerHTML = '<option value="">-- اختر الطالب --</option>';
    myStudents.forEach(function (s) {
        sel.innerHTML += '<option value="' + s.id + '">' + s.name + ' (رقم: ' + s.id + ')</option>';
    });
}

window.handleTeacherSendToParent = function (e) {
    e.preventDefault();
    const studentId = document.getElementById('teacherParentTargetStudent').value;
    const title = document.getElementById('teacherToParentTitle').value.trim();
    const text = document.getElementById('teacherToParentText').value.trim();
    if (!studentId) { showToast('اختر الطالب', 'error'); return; }
    const student = students.find(function (s) { return s.id === studentId; });
    if (!student) return;
    complaints.push({
        id: 'c_' + Date.now(),
        type: 'teacher_to_parent',
        studentId: student.id, studentName: student.name, grade: student.grade,
        teacherId: currentSession.id, teacherName: currentSession.name,
        title: title, text: text,
        date: new Date().toLocaleDateString('ar-SA'),
        reply: ''
    });
    saveToLocalStorage();
    document.getElementById('teacherToParentTitle').value = '';
    document.getElementById('teacherToParentText').value = '';
    document.getElementById('teacherParentTargetStudent').value = '';
    renderTeacherParentComplaints();
    updateAdminComplaintBadgeCount();
    showToast('تم إرسال الرسالة');
};

function renderTeacherParentComplaints() {
    const container = document.getElementById('teacherParentComplaintsList');
    if (!container) return;
    container.innerHTML = '';
    const myId = currentSession.id;

    const incoming = complaints.filter(function (c) { return c.type === 'parent_to_teacher' && c.teacherId === myId; });
    const outgoing = complaints.filter(function (c) { return c.type === 'teacher_to_parent' && c.teacherId === myId; });

    if (incoming.length === 0 && outgoing.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">لا توجد شكاوى أو رسائل</p>';
        return;
    }

    if (incoming.length > 0) {
        container.innerHTML += '<h4 class="font-bold text-amber-700 text-sm mt-2 mb-2"><i class="fa-solid fa-arrow-down"></i> شكاوى واردة من أولياء الأمور</h4>';
        incoming.sort(function (a, b) { return (b.id > a.id) ? 1 : -1; });
        incoming.forEach(function (c) {
            container.innerHTML +=
                '<div class="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">' +
                    '<div class="flex justify-between items-center">' +
                        '<div><h4 class="font-bold text-slate-800">' + c.title + '</h4>' +
                        '<p class="text-xs text-slate-500">الطالب: <strong>' + c.studentName + '</strong> — رقم: ' + c.studentId + '</p></div>' +
                        '<span class="text-xs text-slate-400">' + c.date + '</span>' +
                    '</div>' +
                    '<p class="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">' + c.text + '</p>' +
                    '<div class="space-y-2"><label class="block text-xs font-semibold text-slate-600">الرد:</label>' +
                    '<div class="flex gap-2">' +
                    '<input type="text" id="replyInput_' + c.id + '" value="' + (c.reply || '') + '" placeholder="اكتب ردك..." class="flex-grow p-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600">' +
                    '<button onclick="sendComplaintReply(\'' + c.id + '\')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition">إرسال الرد</button>' +
                    '</div></div></div>';
        });
    }

    if (outgoing.length > 0) {
        container.innerHTML += '<h4 class="font-bold text-emerald-700 text-sm mt-4 mb-2"><i class="fa-solid fa-arrow-up"></i> رسائل أرسلتها لأولياء الأمور</h4>';
        outgoing.sort(function (a, b) { return (b.id > a.id) ? 1 : -1; });
        outgoing.forEach(function (c) {
            container.innerHTML +=
                '<div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">' +
                    '<div class="flex justify-between items-center">' +
                        '<div><h4 class="font-bold text-slate-800">' + c.title + '</h4>' +
                        '<p class="text-xs text-slate-500">إلى ولي أمر: <strong>' + c.studentName + '</strong></p></div>' +
                        '<span class="text-xs text-slate-400">' + c.date + '</span>' +
                    '</div>' +
                    '<p class="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">' + c.text + '</p>' +
                    (c.reply ? '<div class="text-xs text-emerald-700 bg-white p-2 rounded-lg border border-emerald-100"><strong>رد ولي الأمر:</strong> ' + c.reply + '</div>' : '<p class="text-[10px] text-slate-400">لم يرد بعد</p>') +
                '</div>';
        });
    }
}

window.sendComplaintReply = function (complaintId) {
    const replyVal = document.getElementById('replyInput_' + complaintId).value.trim();
    if (!replyVal) { showToast('اكتب نص الرد', 'error'); return; }
    const c = complaints.find(function (item) { return item.id === complaintId; });
    if (c) {
        c.reply = replyVal;
        saveToLocalStorage();
        renderTeacherParentComplaints();
        updateAdminComplaintBadgeCount();
        showToast('تم إرسال الرد');
    }
};

function updateTeacherComplaintBadgeCount() {
    const el = document.getElementById('teacherComplaintBadgeCount');
    if (!el) return;
    const myId = currentSession.id;
    const count = complaints.filter(function (c) {
        return c.type === 'parent_to_teacher' && c.teacherId === myId && !c.reply;
    }).length;
    el.textContent = count;
}

// ========================================================
// 17. بوابة ولي الأمر (مع عرض سبب الخصم)
// ========================================================
function loadParentData() {
    const studentId = currentSession.studentId;
    const student = students.find(function (s) { return s.id === studentId; });
    if (!student) return;
    document.getElementById('parentStudentName').textContent = student.name;
    document.getElementById('parentStudentRegNo').textContent = 'رقم التسجيل: ' + student.id;
    document.getElementById('parentStudentGrade').textContent = student.grade;
    const classTeacher = teachers.find(function (t) { return t.leadClass === student.grade; });
    document.getElementById('parentClassLeader').textContent = classTeacher ? classTeacher.name + ' (' + classTeacher.subject + ')' : 'غير محدد';

    const tbody = document.getElementById('parentGradesTableBody');
    tbody.innerHTML = '';
    const studentGrades = gradesData[studentId] || {};

    teachers.forEach(function (t) {
        const subName = t.subject;
        const subRec = studentGrades[subName];
        const schema = getTeacherSchema(subName);
        let detailsText = '<span class="text-slate-400 text-xs">لم تُدخل الدرجات بعد</span>';
        let reasonsHTML = '';
        let totalScore = 0;

        if (subRec && subRec.parts) {
            if (subRec.submitted !== true) {
                detailsText = '<span class="text-amber-600 text-xs">قيد الإدخال (لم تُرسل بعد)</span>';
            } else {
                let partsArray = []; let hasValue = false;
                schema.forEach(function (item) {
                    const ptVal = subRec.parts[item.name];
                    if (ptVal !== undefined && ptVal !== '') {
                        hasValue = true;
                        totalScore += parseFloat(ptVal) || 0;
                        partsArray.push(item.name + ': ' + ptVal + '/' + item.max);
                    }
                });
                if (hasValue) {
                    detailsText = '<span class="font-bold text-slate-800">' + totalScore + '/100</span> <span class="text-xs text-slate-500 block">(' + partsArray.join(' - ') + ')</span>';
                }
                // ✅ عرض أسباب الخصم لولي الأمر
                if (subRec.reductionReasons) {
                    Object.keys(subRec.reductionReasons).forEach(function (k) {
                        reasonsHTML += '<div class="reduction-reason-display mt-1">خصم في "' + k + '": ' + subRec.reductionReasons[k] + '</div>';
                    });
                }
            }
        }

        tbody.innerHTML += '<tr class="hover:bg-slate-50 transition">' +
            '<td class="p-3 font-bold text-slate-800">' + subName + '</td>' +
            '<td class="p-3 text-slate-600">' + t.name + '</td>' +
            '<td class="p-3">' + detailsText + reasonsHTML + '</td>' +
            '<td class="p-3 text-slate-600">' + (subRec && subRec.note ? subRec.note : '<span class="text-slate-400">لا توجد ملاحظات</span>') + '</td></tr>';
    });

    renderParentComplaints();
}

window.openComplaintModal = function () { document.getElementById('complaintModal').classList.remove('hidden'); };
window.closeComplaintModal = function () { document.getElementById('complaintModal').classList.add('hidden'); };

window.handleSendComplaint = function (e) {
    e.preventDefault();
    const title = document.getElementById('complaintTitle').value.trim();
    const text = document.getElementById('complaintText').value.trim();
    const studentId = currentSession.studentId;
    const student = students.find(function (s) { return s.id === studentId; });
    const classTeacher = teachers.find(function (t) { return t.leadClass === student.grade; });
    if (!classTeacher) {
        showToast('لا يوجد رائد فصل لهذا الصف', 'error'); return;
    }
    complaints.push({
        id: 'c_' + Date.now(),
        type: 'parent_to_teacher',
        studentId: student.id, studentName: student.name, grade: student.grade,
        teacherId: classTeacher.id, teacherName: classTeacher.name,
        title: title, text: text,
        date: new Date().toLocaleDateString('ar-SA'),
        reply: ''
    });
    saveToLocalStorage();
    closeComplaintModal();
    document.getElementById('complaintTitle').value = '';
    document.getElementById('complaintText').value = '';
    renderParentComplaints();
    updateAdminComplaintBadgeCount();
    showToast('تم إرسال الشكوى لرائد الفصل');
};

function renderParentComplaints() {
    const container = document.getElementById('parentComplaintsList');
    if (!container) return;
    container.innerHTML = '';
    const studentId = currentSession.studentId;
    const myComplaints = complaints.filter(function (c) { return c.studentId === studentId; });
    if (myComplaints.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-2">لا توجد شكاوى أو رسائل بعد</p>';
        return;
    }
    myComplaints.sort(function (a, b) { return (b.id > a.id) ? 1 : -1; });
    myComplaints.forEach(function (c) {
        let badge = '', headerInfo = '';
        if (c.type === 'teacher_to_parent') {
            badge = '<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">من رائد الفصل</span>';
            headerInfo = 'من: ' + c.teacherName;
        } else {
            badge = '<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">أرسلتها لرائد الفصل</span>';
            headerInfo = 'إلى: ' + c.teacherName;
        }
        container.innerHTML +=
            '<div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">' +
                '<div class="flex justify-between items-center flex-wrap gap-2">' +
                    '<div class="flex items-center gap-2 flex-wrap">' +
                        '<h4 class="font-bold text-slate-800 text-sm">' + c.title + '</h4>' + badge +
                    '</div>' +
                    '<span class="text-[10px] text-slate-400">' + c.date + ' — ' + headerInfo + '</span>' +
                '</div>' +
                '<p class="text-xs text-slate-600">' + c.text + '</p>' +
                (c.reply ? '<div class="pt-2 border-t border-slate-200 text-xs"><span class="font-semibold text-emerald-700">الرد:</span><p class="text-slate-700 mt-0.5">' + c.reply + '</p></div>' : '<div class="text-[10px] text-amber-600 pt-1">في انتظار الرد...</div>') +
            '</div>';
    });
}

// ========================================================
// 18. التهيئة عند التحميل
// ========================================================
window.addEventListener('DOMContentLoaded', function () {
    console.log('✅ تم تحميل script.js - النسخة النهائية مع جميع التعديلات');

    // تأكد من عدم وجود جلسة قديمة عند تحميل الصفحة أول مرة
    // (هذا يمنع دخول المستخدم بدون كلمة مرور إذا كانت الجلسة القديمة موجودة)
    try {
        const sessionRaw = localStorage.getItem('amal_school_session');
        if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            if (!session || !session.role || !session.name) {
                // جلسة تالفة
                localStorage.removeItem('amal_school_session');
                currentSession = null;
            }
        }
    } catch (e) {
        localStorage.removeItem('amal_school_session');
        currentSession = null;
    }

    applySchoolLogo();
    restoreSession();
});
