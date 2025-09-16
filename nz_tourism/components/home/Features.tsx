import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="card card--feature">
      <div className="card__icon">
        {icon}
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__description">{description}</p>
    </div>
  );
};

export default FeatureCard;