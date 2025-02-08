import home from '../gif/home.png'
import nameAi from '../gif/nameAi.png'
import policy from '../gif/policy.png'
import file from '../gif/file.png'
import headset from '../gif/headset.png'
import setting from '../gif/settings.png'

export const data = {
  versions: ["1.0.1"],
  navMain: [
    {
      url: "/dashboard",
      items: [
        {
          title: "Home",
          url: "/home",
          img: home, // Use imported image directly
        },
        {
          title: "Name Of AI",
          url: "/nameAi",
          img: nameAi,
        },
        {
          title: "HR policies",
          url: "/policy",
          img: policy,
        },
        {
          title: "File Manager",
          url: "/file",
          img: file,
        },
        {
          title: "Tech Support",
          url: "/support",
          img: headset,
        },
      ],
    },
    // {
    //   title: "Market Insights",
    //   url: "#",
    //   items: [
    //     {
    //       title: "About and Feed",
    //       url: "/dashboard/market-intelligence",
    //     },
    //     {
    //       title: "Competitor Comparison",
    //       url: "/dashboard/competitor-mapping",
    //     },
    //     {
    //       title: "Product Comparison",
    //       url: "/dashboard/product-comparison",
    //     },
    //     {
    //       title: "HoundBot",
    //       url: "/dashboard/strategic-insights",
    //     },
    //   ],
    // },
    // {
    //   title: "Audience & Recommendations",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Trends Heatmap",
    //       url: "/dashboard/audience-insights",
    //     },
    //     {
    //       title: "Marketing Campaign",
    //       url: "/dashboard/bulk-mail",
    //     },
    //     {
    //       title: "Linkedin Campaign",
    //       url: "/dashboard/audience-outreach",
    //     },
    //     {
    //       title: "Market Positioning",
    //       url: "/dashboard/audience-segments",
    //     },
    //   ],
    // },
    // {
    //   title: "Feedback & Analytics",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Marketing Questionnaire",
    //       url: "/dashboard/feedback-hub",
    //     },
    //     {
    //       title: "Market Analytics",
    //       url: "/dashboard/feedback-hub/analytics",
    //     },
    //   ],
    // },
    // {
    //   title: "Reports & Data",
    //   url: "#",
    //   items: [
    //     {
    //       title: "HoundBoard",
    //       url: "/dashboard/hound-board",
    //     },
    //     {
    //       title: "HoundReport",
    //       url: "/dashboard/reports",
    //     },
    //   ],
    // },
  ],
};
