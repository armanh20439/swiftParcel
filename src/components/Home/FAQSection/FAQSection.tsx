import React from "react";

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        'Click the "Sign Up" button in the top right corner and follow the simple registration process to create your account.',
    },
    {
      question: "How can I track my parcel?",
      answer:
        "Once your parcel is shipped, you’ll receive a tracking ID. Enter it in the ‘Track Parcel’ section to see real-time updates.",
    },
    {
      question: "What are your delivery charges?",
      answer:
        "Delivery charges depend on parcel weight, delivery distance, and type (standard or express). You can check rates before confirming.",
    },
    {
      question: "Do you offer same-day delivery?",
      answer:
        "Yes! We provide express delivery within 4–6 hours inside Dhaka city for eligible parcels.",
    },
    {
      question: "Can I return a parcel after delivery?",
      answer:
        "Yes, our reverse logistics system allows customers to return or exchange parcels easily through merchants.",
    },
    {
      question: "How do I become a merchant partner?",
      answer:
        "Click on the 'Become a Merchant' button on our website and fill out the application form. Our team will contact you shortly.",
    },
    {
      question: "Do you provide cash-on-delivery service?",
      answer:
        "Yes, we provide 100% cash-on-delivery service nationwide with secure transaction handling.",
    },
    {
      question: "What should I do if my parcel is delayed?",
      answer:
        "You can contact our 24/7 support center or check the tracking portal for delay reasons and updated delivery time.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#03373D] mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              tabIndex={0}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <div className="collapse-title font-semibold text-[#03373D]">
                {faq.question}
              </div>
              <div className="collapse-content text-sm text-gray-600">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
