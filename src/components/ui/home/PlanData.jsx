import React from 'react';
import PlanCard from './PlanCard';

const plans = [
  {
    name: 'Silver',
    price: '3,000',
    color: '#35BAA3',
    period: '/month',
    features: ['10 Contact Views', 'Instant Contact Access', 'SMS/Email Alerts', '30-day validity'],
    highlight: false,
  },
  {
    name: 'Gold',
    price: '5,000',
    color: '#35BAA3',
    period: '/quarter',
    features: ['20 Contact Views', 'Instant Contact Access', 'SMS/Email Alerts', 'Featured Profile', '120-day validity'],
    highlight: true,
  },
  {
    name: 'Platinum',
    price: '10,000',
    color: '#35BAA3',
    period: '/year',
    features: ['50 Contact Views', 'Instant Contact Access', 'Priority Support', 'Verified Badge', '365-day validity'],
    highlight: false,
  }
];

const PlanData = () => {
  return (
    <div className="min-h-50 bg-gray-100 flex items-center justify-center p-15">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            color={plan.color}
            highlight={plan.highlight}
            period={plan.period}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanData;
