/* =========================================================
   script.js — nav toggle, scrollspy, JSON rendering, contact form
   ========================================================= */

$(function () {
  /* ---------- Nav toggle (mobile) ---------- */
  const $navToggle = $("#navToggle");
  const $navList = $("#navList");

  $navToggle.on("click", function () {
    const isOpen = $navList.toggleClass("open").hasClass("open");
    $navToggle.toggleClass("open", isOpen);
    $navToggle.attr("aria-expanded", isOpen ? "true" : "false");
  });

  $navList.find("a").on("click", function () {
    $navList.removeClass("open");
    $navToggle.removeClass("open").attr("aria-expanded", "false");
  });

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const $sections = $("section[id]");
  const $navLinks = $(".nav-link");

  function updateScrollspy() {
    const scrollPos = $(window).scrollTop() + 140;

    let currentId = null;
    $sections.each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        currentId = $(this).attr("id");
      }
    });

    $navLinks.removeClass("active");
    if (currentId) {
      $navLinks.filter(`[href="#${currentId}"]`).addClass("active");
    }
  }

  /* ---------- Scroll-to-top button + header shadow ---------- */
  const $scrollTop = $("#scrollTop");

  function updateOnScroll() {
    updateScrollspy();
    if ($(window).scrollTop() > 500) {
      $scrollTop.addClass("visible");
    } else {
      $scrollTop.removeClass("visible");
    }
  }

  $(window).on("scroll", updateOnScroll);
  updateOnScroll();

  $scrollTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  /* ---------- JSON-driven rendering ---------- */

  function escapeHtml(str) {
    return $("<div>").text(str).html();
  }

  // Skills
  $.getJSON("skills.json")
    .done(function (groups) {
      const $skills = $("#skills");
      $skills.empty();

      groups.forEach(function (group) {
        const tags = group.items
          .map((item) => `<span class="skill-tag">${escapeHtml(item)}</span>`)
          .join("");

        const $group = $(`
          <div class="skills-group reveal">
            <h3><i class="fa-solid ${escapeHtml(group.icon)} section-icon" aria-hidden="true"></i>${escapeHtml(group.group)}</h3>
            <div class="skill-tags">${tags}</div>
          </div>
        `);
        $skills.append($group);
      });

      if (typeof ScrollReveal !== "undefined") {
        ScrollReveal().reveal("#skills .reveal", { interval: 80 });
      }
    })
    .fail(function () {
      $("#skills").html(
        '<p class="empty-state">Skills could not be loaded right now.</p>'
      );
    });

  // Portfolio folder cards
  $.getJSON("portfolio.json")
    .done(function (folders) {
      const $grid = $("#portfolioGrid");
      $grid.empty();

      if (!folders.length) {
        $grid.append(
          '<p class="empty-state">No portfolio folders yet — check back soon.</p>'
        );
        return;
      }

      folders.forEach(function (folder) {
        const $card = $(`
          <article class="folder-card reveal">
            <div class="folder-icon" aria-hidden="true">${folder.icon}</div>
            <h3>${escapeHtml(folder.name)}</h3>
            <a class="btn btn-card" href="${escapeHtml(folder.url)}"
               target="_blank" rel="noopener"
               aria-label="Open ${escapeHtml(folder.name)} folder in a new tab">
              Open Folder <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </article>
        `);
        $grid.append($card);
      });

      if (typeof VanillaTilt !== "undefined") {
        VanillaTilt.init($grid.find(".folder-card").get(), {
          max: 6,
          speed: 400,
          glare: true,
          "max-glare": 0.15,
          scale: 1.02,
        });
      }
      if (typeof ScrollReveal !== "undefined") {
        ScrollReveal().reveal("#portfolioGrid .reveal", { interval: 80 });
      }
    })
    .fail(function () {
      $("#portfolioGrid").html(
        '<p class="empty-state">Portfolio folders could not be loaded right now.</p>'
      );
    });

  // Research write-ups, grouped by category
  $.getJSON("research.json")
    .done(function (items) {
      renderResearch(items, "history", "#historyGrid");
      renderResearch(items, "geopolitics", "#geopoliticsGrid");
      renderResearch(items, "true-crime", "#trueCrimeGrid");
    })
    .fail(function () {
      $("#historyGrid, #geopoliticsGrid, #trueCrimeGrid").html(
        '<p class="empty-state">Research write-ups could not be loaded right now.</p>'
      );
    });

  function renderResearch(items, category, targetSelector) {
    const $grid = $(targetSelector);
    if (!$grid.length) return;

    const matches = items.filter((item) => item.category === category);
    $grid.empty();

    if (!matches.length) {
      $grid.append(
        '<p class="empty-state">No write-ups in this category yet — check back soon.</p>'
      );
      return;
    }

    matches.forEach(function (item) {
      const tags = item.tags
        .map((tag) => `<span class="research-tag">${escapeHtml(tag)}</span>`)
        .join("");

      const $card = $(`
        <article class="research-card reveal">
          <h3>${escapeHtml(item.title)}</h3>
          <div class="research-tags">${tags}</div>
          <a class="btn btn-card" href="${escapeHtml(item.url)}"
             target="_blank" rel="noopener"
             aria-label="Read document: ${escapeHtml(item.title)} (opens in a new tab)">
            Read Document <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </article>
      `);
      $grid.append($card);
    });

    if (typeof VanillaTilt !== "undefined") {
      VanillaTilt.init($grid.find(".research-card").get(), {
        max: 6,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02,
      });
    }
    if (typeof ScrollReveal !== "undefined") {
      ScrollReveal().reveal(`${targetSelector} .reveal`, { interval: 80 });
    }
  }

  /* ---------- Contact form -> mailto ---------- */
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const message = $("#message").val().trim();
    const targetEmail = "kamranafzal12.ka@gmail.com";

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  });
});
