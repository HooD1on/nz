'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="hero">
      <div className="floating-icons">
        <div className="icon-item icon-1">🏔️</div>
        <div className="icon-item icon-2">🌊</div>
        <div className="icon-item icon-3">🌋</div>
        <div className="icon-item icon-4">🏄</div>
        <div className="icon-item icon-5">🥝</div>
        <div className="icon-item icon-6">🐑</div>
        <div className="icon-item icon-7">⛵</div>
        <div className="icon-item icon-8">🧗</div>
      </div>

      <div className="hero-content">
        <h2 className="hero-subtitle">梦幻新西兰之旅</h2>
        <h1 className="hero-title">非凡冒险</h1>
        <p className="hero-description">
          探索壮丽的自然风光，感受丰富的毛利文化，体验北岛和南岛令人难忘的精彩活动
        </p>

        <div className="experience-badges">
          <div className="badge">
            <span className="badge-number">200+</span>
            <span className="badge-text">精选景点</span>
          </div>
          <div className="badge">
            <span className="badge-number">50+</span>
            <span className="badge-text">特色体验</span>
          </div>
          <div className="badge">
            <span className="badge-number">24/7</span>
            <span className="badge-text">专业服务</span>
          </div>
        </div>

        <div className="featured-spot">
          <div className="featured-pill">本月推荐</div>
          <h3 className="featured-name">皇后镇探险</h3>
          <div className="featured-rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="rating-number">4.9</span>
          </div>
        </div>

        <div className="hero-buttons">
          <Link href="/destinations" className="primary-btn">探索目的地</Link>
          <Link href="/contact" className="secondary-btn">定制行程</Link>
        </div>
      </div>
    </section>
  )
}

export default Hero 