/* ==========================================================================
   K.D Group Construction - Main JavaScript Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Navigation Header ---
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load to ensure state matches initial reload position


    // --- 2. Mobile Menu Drawer Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        
        // Prevent background scrolling when menu is open on mobile
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu drawer when clicking on any menu link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    // --- 3. Scroll Spy (Active Navigation Links) ---
    const sections = document.querySelectorAll('section');
    
    const scrollSpyOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of the screen
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });


// --- 4. Interactive Form Submission with Mock Toast/Modal Dialog ---
    const contactForm = document.getElementById('construction-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // เบรกฟอร์มเพื่อทำเอฟเฟกต์ป๊อปอัพ
            
            // Gather form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const projectType = formData.get('project_type');

            // 🚀 เพิ่มโค้ดส่งข้อมูลไป Formspree ผ่านเบื้องหลัง (AJAX Fetch)
            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('ส่งข้อมูลไป Formspree สำเร็จ!');
                } else {
                    console.error('มีข้อผิดพลาดจาก Formspree');
                }
            })
            .catch(error => console.error('เกิดข้อผิดพลาดในการเชื่อมต่อเน็ตเวิร์ก:', error));
            
            // Create a premium notification overlay dynamically
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100vw';
            modalOverlay.style.height = '100vh';
            modalOverlay.style.backgroundColor = 'rgba(15, 18, 22, 0.85)';
            modalOverlay.style.backdropFilter = 'blur(15px)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.zIndex = '9999';
            modalOverlay.style.opacity = '0';
            modalOverlay.style.transition = 'opacity 0.4s ease';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = '#161b22';
            modalContent.style.border = '1px solid #e5a93b';
            modalContent.style.padding = '40px';
            modalContent.style.borderRadius = '16px';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.textAlign = 'center';
            modalContent.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            modalContent.style.transform = 'scale(0.8)';
            modalContent.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Successful checkmark SVG icon
            const successIcon = `
                <div style="width: 80px; height: 80px; background-color: rgba(229, 169, 59, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; border: 2px solid #e5a93b;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e5a93b" stroke-width="3" style="width: 40px; height: 40px;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            `;

            let projectTypeName = 'โครงการทั่วไป';
            if (projectType === 'residential') projectTypeName = 'บ้านพักอาศัย / คฤหาสน์';
            else if (projectType === 'commercial') projectTypeName = 'อาคารพาณิชย์ / ตึกสำนักงาน';
            else if (projectType === 'renovation') projectTypeName = 'งานรีโนเวทและออกแบบภายใน';
            else if (projectType === 'consulting') projectTypeName = 'บริการที่ปรึกษาวิศวกรรม';

            modalContent.innerHTML = `
                ${successIcon}
                <h3 style="color: #f0f2f5; font-size: 1.8rem; font-weight: 700; margin-bottom: 12px; font-family: 'Noto Sans Thai', sans-serif;">ส่งข้อมูลปรึกษาเรียบร้อย!</h3>
                <p style="color: #9ba3af; font-size: 1rem; margin-bottom: 24px; line-height: 1.6; font-family: 'Noto Sans Thai', sans-serif;">
                    ขอบคุณ <strong>คุณ${name}</strong> ที่สนใจร่วมงานกับ K.D Group Construction<br>
                    เราจะติดต่อกลับที่เบอร์ <strong>${phone}</strong> เพื่อปรึกษาโครงการประเภท <strong>${projectTypeName}</strong> ภายใน 24 ชั่วโมงครับ
                </p>
                <button id="close-modal-btn" style="background-color: #e5a93b; color: #0f1216; padding: 12px 30px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.3s; font-family: 'Noto Sans Thai', sans-serif;">ตกลง</button>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // Animate In
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);

            // Close function
            const closeModal = () => {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    contactForm.reset();
                }, 400);
            };

            const closeButton = modalContent.querySelector('#close-modal-btn');
            closeButton.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (event) => {
                if (event.target === modalOverlay) {
                    closeModal();
                }
            });
        });
    }

    // --- 5. Newsletter Sign Up Mock ---
    const newsletterBtn = document.getElementById('btn-newsletter');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            const emailInput = newsletterBtn.previousElementSibling;
            if (emailInput && emailInput.value) {
                alert(`ลงทะเบียนรับจดหมายข่าวเรียบร้อยสำหรับอีเมล: ${emailInput.value}`);
                emailInput.value = '';
            } else {
                alert('กรุณากรอกอีเมลของคุณเพื่อลงทะเบียน');
            }
        });
    }

});
