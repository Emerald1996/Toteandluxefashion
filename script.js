(function () {
            // ---- config ----
            var WHATSAPP_NUMBER = "2349068926260";
            var DEFAULT_MSG = "Hi Tote & Luxe, I'd love to see the current collection.";

            function waLink(msg) {
                return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
            }

            document.querySelectorAll(".wa-link").forEach(function (el) {
                var product = el.getAttribute("data-product");
                var msg = product ? ("Hi Tote & Luxe, I'm interested in " + product + ". Is it available?") : DEFAULT_MSG;
                el.setAttribute("href", waLink(msg));
            });
            document.getElementById("navWa").setAttribute("href", waLink(DEFAULT_MSG));

            // ---- preloader ----
            window.addEventListener("load", function () {
                setTimeout(function () {
                    document.getElementById("preloader").classList.add("hide");
                }, 450);
            });

            // ---- header on scroll ----
            var header = document.getElementById("siteHeader");
            var topBtn = document.getElementById("topBtn");
            window.addEventListener("scroll", function () {
                var y = window.scrollY;
                header.classList.toggle("scrolled", y > 40);
                topBtn.classList.toggle("show", y > 700);
            });
            topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

            // ---- mobile nav ----
            var burger = document.getElementById("burger");
            var navLinks = document.getElementById("navLinks");
            burger.addEventListener("click", function () { navLinks.classList.toggle("open"); });
            navLinks.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () { navLinks.classList.remove("open"); });
            });

            // ---- reveal on scroll ----
            var revealEls = document.querySelectorAll(".reveal");
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
                });
            }, { threshold: 0.15 });
            revealEls.forEach(function (el) { io.observe(el); });

            // ---- particles ----
            var pWrap = document.getElementById("particles");
            for (var i = 0; i < 18; i++) {
                var p = document.createElement("div");
                p.className = "particle";
                p.style.left = (Math.random() * 100) + "%";
                p.style.animationDuration = (10 + Math.random() * 12) + "s";
                p.style.animationDelay = (Math.random() * 14) + "s";
                pWrap.appendChild(p);
            }

            // ---- wishlist toggle ----
            document.querySelectorAll(".wish-btn").forEach(function (btn) {
                btn.addEventListener("click", function () { btn.classList.toggle("active"); });
            });

            // ---- testimonial carousel ----
            var slides = document.querySelectorAll(".testi-slide");
            var dots = document.querySelectorAll(".testi-dots button");
            var cur = 0;
            function showSlide(i) {
                slides.forEach(function (s, idx) { s.classList.toggle("active", idx === i); });
                dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
                cur = i;
            }
            dots.forEach(function (d) {
                d.addEventListener("click", function () { showSlide(parseInt(d.getAttribute("data-i"))); });
            });
            setInterval(function () { showSlide((cur + 1) % slides.length); }, 5500);

            // ---- animated stats ----
            var statEls = document.querySelectorAll(".num[data-count]");
            var statIo = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        animateCount(e.target);
                        statIo.unobserve(e.target);
                    }
                });
            }, { threshold: 0.6 });
            statEls.forEach(function (el) { statIo.observe(el); });

            function animateCount(el) {
                var target = parseInt(el.getAttribute("data-count"), 10);
                var suffix = el.getAttribute("data-suffix") || "";
                var start = 0;
                var duration = 1400;
                var startTime = null;
                function step(ts) {
                    if (!startTime) startTime = ts;
                    var progress = Math.min((ts - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var val = Math.round(eased * target);
                    el.textContent = val + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }

            // ---- waitlist form (front-end only) ----
            // var wlForm = document.getElementById("waitlistForm");
            // wlForm.addEventListener("submit", function (e) {
            //     e.preventDefault();
            //     wlForm.style.display = "none";
            //     document.getElementById("wlThanks").style.display = "block";
            // });



            // ---- waitlist form (Google Sheets) ----

            var wlForm = document.getElementById("waitlistForm");
            var wlThanks = document.getElementById("wlThanks");
            var wlButton = wlForm.querySelector('button[type="submit"]');

            var scriptURL = "https://script.google.com/macros/s/AKfycbzIJC-Wy3_4leTPXln1uZdiBKDTPbPX6KvBmx_GM634UnZik73oJnea956s-f18xQQLLg/exec";

            wlForm.addEventListener("submit", function (e) {
                e.preventDefault();

                wlButton.disabled = true;
                wlButton.textContent = "Joining...";

                fetch(scriptURL, {
                    method: "POST",
                    body: new FormData(wlForm)
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    console.log("Waitlist response:", data);

                    // NEW SUBSCRIBER
                    if (data.result === "success") {

                        wlForm.style.display = "none";
                        wlThanks.textContent =
                            "You're on the list — welcome to the Insider circle.";
                        wlThanks.style.display = "block";

                        wlForm.reset();
                        return;
                    }

                    // ALREADY SUBSCRIBED
                    if (data.result === "duplicate") {

                        wlForm.style.display = "none";
                        wlThanks.textContent =
                            "You're already on the list — we'll keep you posted.";
                        wlThanks.style.display = "block";

                        wlForm.reset();
                        return;
                    }

                    // SERVER RETURNED AN ERROR
                    throw new Error(data.message || "Subscription failed");

                })
                .catch(function (error) {

                    console.error("Waitlist submission error:", error);

                    wlButton.disabled = false;
                    wlButton.textContent = "Join the Waitlist";

                    alert("We couldn't add you to the waitlist. Please try again.");
                });
            });


            // ---- countdown ----
            // var launchDate = new Date("2026-08-15T00:00:00+01:00").getTime();
            // function tickCountdown() {
            //     var now = Date.now();
            //     var diff = Math.max(launchDate - now, 0);
            //     var d = Math.floor(diff / 86400000);
            //     var h = Math.floor((diff % 86400000) / 3600000);
            //     var m = Math.floor((diff % 3600000) / 60000);
            //     var s = Math.floor((diff % 60000) / 1000);
            //     document.getElementById("cdDays").textContent = String(d).padStart(2, "0");
            //     document.getElementById("cdHours").textContent = String(h).padStart(2, "0");
            //     document.getElementById("cdMins").textContent = String(m).padStart(2, "0");
            //     document.getElementById("cdSecs").textContent = String(s).padStart(2, "0");
            // }
            // tickCountdown();
            // setInterval(tickCountdown, 1000);

            

            // ---- faq accordion ----
            document.querySelectorAll(".faq-item").forEach(function (item) {
                var q = item.querySelector(".faq-q");
                var a = item.querySelector(".faq-a");
                if (item.classList.contains("open")) { a.style.maxHeight = a.scrollHeight + "px"; }
                q.addEventListener("click", function () {
                    var isOpen = item.classList.contains("open");
                    document.querySelectorAll(".faq-item").forEach(function (other) {
                        other.classList.remove("open");
                        other.querySelector(".faq-a").style.maxHeight = null;
                    });
                    if (!isOpen) {
                        item.classList.add("open");
                        a.style.maxHeight = a.scrollHeight + "px";
                    }
                });
            });
        })();