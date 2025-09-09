<script setup lang="ts">
import TgIcon from '@/components/icons/TgIcon.vue'
import VkIcon from '@/components/icons/VkIcon.vue'
import OkIcon from '@/components/icons/OkIcon.vue'
import YtIcon from '@/components/icons/YtIcon.vue'
</script>

<template>
  <div class="footer">
    <div class="footer-top">
      <span class="footer-llc">LLC&nbsp;«Мультимедиа Визион»</span>
      <span class="footer-rights">&#169; Все права защищены</span>
    </div>

    <ul class="list-reset flex-row flex-justify-spb flex-align-center social-icons">
      <li class="icon-wrap">
        <a href="#" class="icon-link"><VkIcon class="icon" /></a>
      </li>
      <li class="icon-wrap">
        <a href="#" class="icon-link"><YtIcon class="icon" /></a>
      </li>
      <li class="icon-wrap">
        <a href="#" class="icon-link"><OkIcon class="icon" /></a>
      </li>
      <li class="icon-wrap">
        <a href="#" class="icon-link"><TgIcon class="icon" /></a>
      </li>
    </ul>
  </div>
</template>

<style>
.footer-llc {
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col4);
}

.footer-rights {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: var(--palette-col12);
}

.social-icons {
  column-gap: 24px;
  width: auto;
}

.icon-link {
  display: inline-block;
  height: 0;
}

.icon-wrap {
  height: 24px;
}

.icon {
  width: 24px;
  height: 24px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  column-gap: 12px;
  width: 100%;
  flex-wrap: wrap;
  row-gap: 8px;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 32px;
  padding: 24px 0;
  column-gap: 24px;
}

@media (min-width: 376px) {
  .footer-top {
    flex-wrap: nowrap;
  }

  .footer-rights {
    font-size: 18px;
    color: var(--palette-col4);
  }

  .icon {
    width: 36px;
    height: 36px;
  }

  .icon-wrap {
    height: 36px;
  }

  .footer {
    padding: 40px 0;
  }
}

@media (min-width: 600px) {
  .footer {
    flex-wrap: nowrap;
  }

  .footer-top {
    width: auto;
  }
}
</style>
