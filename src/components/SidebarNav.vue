<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="sidebar glass-panel">
    <div class="brand-block">
      <RouterLink class="brand-link" to="/album" aria-label="We World 首页">
        <span class="brand-mark" aria-hidden="true">
          <span></span>
          <span></span>
          <i></i>
        </span>
        <span class="brand-type">
          <strong>We World</strong>
          <small>our little universe</small>
        </span>
      </RouterLink>
      <p class="brand-copy">把平凡的日子，过成只属于我们的宇宙。</p>
    </div>

    <nav class="primary-nav" aria-label="主要功能">
      <RouterLink class="nav-item" to="/album">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="14" rx="3" />
            <circle cx="9" cy="10" r="1.7" />
            <path d="m5.5 17 4.6-4.4 3.1 2.7 2.4-2.2 3 3.9" />
          </svg>
        </span>
        <span class="nav-label">相册展示</span>
        <span class="nav-index">01</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/settings">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" />
            <path d="M19 12a7.5 7.5 0 0 0-.08-1.1l2-1.5-2-3.4-2.3.9a7 7 0 0 0-1.9-1.1L14.4 3h-4.8l-.3 2.8a7 7 0 0 0-1.9 1.1l-2.3-.9-2 3.4 2 1.5a7.5 7.5 0 0 0 0 2.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 1.9 1.1l.3 2.8h4.8l.3-2.8a7 7 0 0 0 1.9-1.1l2.3.9 2-3.4-2-1.5c.05-.36.08-.73.08-1.1Z" />
          </svg>
        </span>
        <span class="nav-label">设置</span>
        <span class="nav-index">02</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <span class="footer-orbit" aria-hidden="true">
        <i></i>
      </span>
      <div>
        <p>Made for two</p>
        <span>since 2026.08.11</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 30px 22px 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 30px;
  background:
    linear-gradient(170deg, rgba(255, 252, 247, 0.92), rgba(248, 240, 231, 0.82)),
    radial-gradient(circle at 12% 8%, rgba(214, 130, 126, 0.13), transparent 35%);
  box-shadow: 0 24px 70px rgba(82, 53, 40, 0.08);
}

.sidebar::before {
  position: absolute;
  top: -94px;
  right: -86px;
  width: 180px;
  height: 180px;
  border: 1px solid rgba(136, 82, 69, 0.1);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.sidebar::after {
  position: absolute;
  top: -50px;
  right: -42px;
  width: 92px;
  height: 92px;
  border: 1px solid rgba(136, 82, 69, 0.11);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.brand-block {
  position: relative;
  z-index: 1;
}

.brand-link {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  color: var(--ink);
  text-decoration: none;
}

.brand-mark {
  position: relative;
  display: block;
  width: 50px;
  height: 38px;
  flex: 0 0 auto;
}

.brand-mark span {
  position: absolute;
  top: 4px;
  width: 30px;
  height: 30px;
  border: 1.5px solid var(--wine);
  border-radius: 50%;
}

.brand-mark span:first-child {
  left: 0;
  background: rgba(132, 53, 67, 0.04);
}

.brand-mark span:nth-child(2) {
  right: 0;
  border-color: var(--rose);
}

.brand-mark i {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--coral);
  box-shadow: 0 0 0 4px rgba(204, 99, 93, 0.09);
  transform: translateX(-50%);
}

.brand-type {
  display: flex;
  flex-direction: column;
}

.brand-type strong {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.brand-type small {
  margin-top: 6px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

.brand-copy {
  max-width: 170px;
  margin: 32px 0 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 13px;
  line-height: 1.9;
}

.primary-nav {
  display: grid;
  gap: 9px;
  margin-top: auto;
  padding-top: 34px;
}

.nav-item {
  position: relative;
  display: flex;
  gap: 11px;
  align-items: center;
  min-height: 56px;
  padding: 0 12px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 17px;
  color: var(--muted);
  text-decoration: none;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.nav-item:hover {
  color: var(--ink);
  transform: translateX(2px);
}

.nav-item.router-link-active {
  border-color: rgba(147, 78, 69, 0.12);
  color: var(--wine);
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 9px 24px rgba(92, 55, 43, 0.05);
}

.nav-item.router-link-active::before {
  position: absolute;
  left: 0;
  width: 3px;
  height: 20px;
  border-radius: 0 3px 3px 0;
  background: var(--coral);
  content: '';
  pointer-events: none;
}

.nav-icon {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  place-items: center;
}

.nav-icon svg {
  width: 20px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.nav-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.nav-index {
  margin-left: auto;
  color: rgba(107, 82, 72, 0.4);
  font-family: var(--font-display);
  font-size: 10px;
  font-style: italic;
}

.sidebar-footer {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 30px;
  padding-top: 19px;
  border-top: 1px solid rgba(121, 86, 72, 0.09);
}

.footer-orbit {
  position: relative;
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  border: 1px solid rgba(141, 80, 70, 0.26);
  border-radius: 50%;
  place-items: center;
}

.footer-orbit::before {
  position: absolute;
  width: 37px;
  height: 15px;
  border: 1px solid rgba(141, 80, 70, 0.2);
  border-radius: 50%;
  content: '';
  pointer-events: none;
  transform: rotate(-34deg);
}

.footer-orbit i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--coral);
}

.sidebar-footer p,
.sidebar-footer span {
  margin: 0;
}

.sidebar-footer p {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 12px;
  font-style: italic;
}

.sidebar-footer div > span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 1180px) {
  .sidebar {
    position: sticky;
    top: 10px;
    z-index: 20;
    flex-direction: row;
    align-items: center;
    min-height: auto;
    padding: 10px 12px;
    border-radius: 22px;
  }

  .brand-block {
    flex: 1;
    min-width: 0;
  }

  .brand-link {
    gap: 9px;
  }

  .brand-mark {
    width: 40px;
    height: 32px;
    transform: scale(0.84);
    transform-origin: left center;
  }

  .brand-mark span {
    top: 2px;
  }

  .brand-type strong {
    font-size: 20px;
  }

  .brand-type small,
  .brand-copy,
  .sidebar-footer {
    display: none;
  }

  .primary-nav {
    display: flex;
    gap: 4px;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    min-height: 42px;
    padding: 0 13px;
    border-radius: 13px;
  }

  .nav-item.router-link-active::before,
  .nav-index {
    display: none;
  }

  .nav-icon {
    width: 19px;
    height: 19px;
  }

  .nav-icon svg {
    width: 18px;
  }

  .nav-label {
    font-size: 12px;
  }
}

@media (max-width: 500px) {
  .sidebar {
    padding: 9px 10px;
  }

  .brand-mark {
    width: 32px;
    transform: scale(0.72);
  }

  .brand-type strong {
    font-size: 18px;
  }

  .nav-item {
    gap: 6px;
    min-height: 38px;
    padding: 0 9px;
  }

  .nav-icon {
    display: none;
  }

  .nav-label {
    font-size: 11px;
  }
}
</style>


