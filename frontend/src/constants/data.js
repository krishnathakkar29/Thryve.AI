import home from '../gif/home.png'
import nameAi from '../gif/nameAi.png'
import task from '../gif/task.png'
import file from '../gif/file.png'
import news from '../gif/news.png'
import setting from '../gif/settings.png'

export const data = {
  versions: ["1.0.1"],
  navMain: [
    {
      url: "/dashboard",
      items: [
        {
          title: "Home",
          url: "/dashboard",
          img: home, // Use imported image directly
        },
        {
          title: "Thryve",
          url: "/chat",
          img: nameAi,
        },
        {
          title: "Task Manager",
          url: "/tasks",
          img: task,
        },
        {
          title: "File Manager",
          url: "/report",
          img: file,
        },
        {
          title: "Recent News",
          url: "/news",
          img: news,
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
