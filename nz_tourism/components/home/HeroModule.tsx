'use client'

import React from 'react'
import Link from 'next/link'
import styles from './HeroModule.module.css'

const HeroModule = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.floatingIcons}>
        <div className={`${styles.iconItem} ${styles.icon1}`}>🏔️</div>
        <div className={`${styles.iconItem} ${styles.icon2}`}>🌊</div>
        <div className={`${styles.iconItem} ${styles.icon3}`}>🌋</div>
        <div className={`${styles.iconItem} ${styles.icon4}`}>🏄</div>
        <div className={`${styles.iconItem} ${styles.icon5}`}>🥝</div>
        <div className={`${styles.iconItem} ${styles.icon6}`}>🐑</div>
        <div className={`${styles.iconItem} ${styles.icon7}`}>⛵</div>
        <div className={`${styles.iconItem} ${styles.icon8}`}>🧗</div>
      </div>

      <div className={styles.heroContent}>
        <h2 className={styles.heroSubtitle}>梦幻新西兰之旅</h2>
        <h1 className={styles.heroTitle}>非凡冒险</h1>
        <p className={styles.heroDescription}>
          探索壮丽的自然风光，感受丰富的毛利文化，体验北岛和南岛令人难忘的精彩活动
        </p>

        <div className={styles.experienceBadges}>
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>200+</span>
            <span className={styles.badgeText}>精选景点</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>50+</span>
            <span className={styles.badgeText}>特色体验</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>24/7</span>
            <span className={styles.badgeText}>专业服务</span>
          </div>
        </div>

        <div className={styles.featuredSpot}>
          <div className={styles.featuredPill}>本月推荐</div>
          <h3 className={styles.featuredName}>皇后镇探险</h3>
          <div className={styles.featuredRating}>
            <span className={styles.star}>★</span>
            <span className={styles.star}>★</span>
            <span className={styles.star}>★</span>
            <span className={styles.star}>★</span>
            <span className={styles.star}>★</span>
            <span className={styles.ratingNumber}>4.9</span>
          </div>
        </div>

        <div className={styles.heroButtons}>
          <Link href="/destinations" className={styles.primaryBtn}>探索目的地</Link>
          <Link href="/contact" className={styles.secondaryBtn}>定制行程</Link>
        </div>
      </div>
    </section>
  )
}

export default HeroModule 