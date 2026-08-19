"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([["310"],{829(e,r,t){t.r(r),t.d(r,{metadata:()=>a,default:()=>m,frontMatter:()=>s,contentTitle:()=>d,ApiDocsCard:()=>c,assets:()=>p,toc:()=>b});var a=JSON.parse('{"id":"api-reference","title":"Open API","description":"if (isSameOrigin) {","source":"@site/docs/api-reference.mdx","sourceDirName":".","slug":"/api-reference","permalink":"/apprise_vercel/api-reference","draft":false,"unlisted":false,"editUrl":"https://github.com/sinspired/apprise_vercel/wiki/docs/api-reference.mdx","tags":[],"version":"current","frontMatter":{"id":"api-reference","title":"Open API","sidebar_label":"API \u6587\u6863"},"sidebar":"mainSidebar","previous":{"title":"API \u8C03\u7528","permalink":"/apprise_vercel/API\u8C03\u7528"}}'),i=t(1987),n=t(7008),o=t(5091),l=t(9179);let s={id:"api-reference",title:"Open API",sidebar_label:"API \u6587\u6863"},d,p={};function c(){let{siteConfig:e}=(0,o.A)(),r=e.customFields?.apiDocsUrl??"<https://apprise.linkpc.dpdns.org/open-api>";return r.startsWith("/")?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("style",{children:`
          .theme-doc-markdown {
            scrollbar-width: thin;
            scrollbar-color: rgba(192,132,252,0.4) transparent;
          }
          .theme-doc-markdown::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .theme-doc-markdown::-webkit-scrollbar-track {
            background: transparent;
          }
          .theme-doc-markdown::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #c084fc, #e879f9);
            border-radius: 999px;
          }
          .theme-doc-markdown::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #a855f7, #d946ef);
          }
          .main-wrapper, html {
            scrollbar-width: thin;
            scrollbar-color: rgba(192,132,252,0.4) transparent;
          }
          .main-wrapper::-webkit-scrollbar,
          html::-webkit-scrollbar {
            width: 6px;
          }
          .main-wrapper::-webkit-scrollbar-track,
          html::-webkit-scrollbar-track {
            background: transparent;
          }
          .main-wrapper::-webkit-scrollbar-thumb,
          html::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #c084fc, #e879f9);
            border-radius: 999px;
          }
          .main-wrapper::-webkit-scrollbar-thumb:hover,
          html::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #a855f7, #d946ef);
          }
        `}),(0,i.jsx)("iframe",{src:r,style:{width:"100%",height:"80vh",border:"none",borderRadius:"8px",marginTop:"16px"},title:"API \u53C2\u8003\u6587\u6863"})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("style",{children:`
        .main-wrapper, html {
          scrollbar-width: thin;
          scrollbar-color: rgba(192,132,252,0.4) transparent;
        }
        .main-wrapper::-webkit-scrollbar,
        html::-webkit-scrollbar {
          width: 6px;
        }
        .main-wrapper::-webkit-scrollbar-track,
        html::-webkit-scrollbar-track {
          background: transparent;
        }
        .main-wrapper::-webkit-scrollbar-thumb,
        html::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #c084fc, #e879f9);
          border-radius: 999px;
        }
        .main-wrapper::-webkit-scrollbar-thumb:hover,
        html::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a855f7, #d946ef);
        }
      `}),(0,i.jsxs)("div",{style:{marginTop:"24px",borderRadius:"16px",border:"1px solid var(--ifm-color-emphasis-200)",overflow:"hidden",background:"var(--ifm-card-background-color)",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"},children:[(0,i.jsx)("div",{style:{height:"4px",background:"linear-gradient(90deg, #7c3aed, #06b6d4)"}}),(0,i.jsxs)("div",{style:{padding:"40px 32px",textAlign:"center"},children:[(0,i.jsx)("div",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"56px",height:"56px",borderRadius:"14px",background:"linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.12))",marginBottom:"20px"},children:(0,i.jsxs)("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"url(#grad)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,i.jsx)("defs",{children:(0,i.jsxs)("linearGradient",{id:"grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[(0,i.jsx)("stop",{offset:"0%",stopColor:"#7c3aed"}),(0,i.jsx)("stop",{offset:"100%",stopColor:"#06b6d4"})]})}),(0,i.jsx)("polyline",{points:"16 18 22 12 16 6"}),(0,i.jsx)("polyline",{points:"8 6 2 12 8 18"})]})}),(0,i.jsx)("h2",{style:{margin:"0 0 8px",fontSize:"1.5rem",fontWeight:700,background:"linear-gradient(90deg, #7c3aed, #06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Apprise Notify API"}),(0,i.jsxs)("p",{style:{margin:"0 0 8px",color:"var(--ifm-color-emphasis-600)",fontSize:"0.95rem",lineHeight:1.6},children:["\u57FA\u4E8E OpenAPI 3.0\uFF0C\u63D0\u4F9B\u4EA4\u4E92\u5F0F\u6587\u6863\u4E0E\u5728\u7EBF\u8C03\u8BD5\u3002",(0,i.jsx)("br",{}),"\u652F\u6301 Bark\u3001ntfy\u3001Discord\u3001Telegram \u7B49 100+ \u6E20\u9053\u3002"]}),(0,i.jsx)("div",{style:{display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap",margin:"16px 0 28px"},children:["OpenAPI 3.0","Scalar UI","POST /notify"].map(e=>(0,i.jsx)("span",{style:{padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:500,background:"var(--ifm-color-emphasis-100)",color:"var(--ifm-color-emphasis-700)",border:"1px solid var(--ifm-color-emphasis-200)"},children:e},e))}),(0,i.jsxs)("div",{style:{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"},children:[(0,i.jsx)(l.A,{href:r,target:"_blank",rel:"noopener noreferrer",className:"button button--primary",style:{borderRadius:"8px",fontWeight:600},children:"\u6253\u5F00 API \u6587\u6863 \u2192"}),(0,i.jsx)(l.A,{href:r.replace("/open-api","/openapi.json"),target:"_blank",rel:"noopener noreferrer",className:"button button--outline button--secondary",style:{borderRadius:"8px"},children:"openapi.json"})]}),(0,i.jsx)("p",{style:{marginTop:"20px",fontSize:"11px",color:"var(--ifm-color-emphasis-400)",fontFamily:"monospace"},children:r})]})]})]})}let b=[];function h(e){return(0,i.jsx)(c,{})}function m(e={}){let{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,i.jsx)(r,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},7008(e,r,t){t.d(r,{R:()=>o,x:()=>l});var a=t(1763);let i={},n=a.createContext(i);function o(e){let r=a.useContext(n);return a.useMemo(function(){return"function"==typeof e?e(r):{...r,...e}},[r,e])}function l(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),a.createElement(n.Provider,{value:r},e.children)}}}]);