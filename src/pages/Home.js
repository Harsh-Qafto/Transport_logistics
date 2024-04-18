
    import React, { useState } from "react"
    import HomeJSON from "./Home.json";
    import { RSortable } from "qaftoplaygroundnew";
    import { Helmet } from 'react-helmet'
    import {staticData} from './StaticData'


    export default function Home() {
        const [data, setData] = useState({
            title: "",
            description: "",
            keywords: "",
            canonical: window.location.href,
            metaData: {
              title: "",
              description: "",
              type: ""
            }
        })
        
        return (
            <>
            <Helmet>
            {data?.title && data?.title.length > 0 && <title>{data?.title}</title>}
            {data?.description && data?.description.length > 0 && <meta name="description" content={data.description} />}
            {data?.keywords && data.keywords.length > 0 && <meta name="keywords" content={data.keywords} />}
            <link rel="canonical" href={window.location.href} />
            <link rel="alternate" hreflang="en" href={window.location.href} />
            {data?.meta_data?.title && data?.meta_data?.title.length > 0 && <meta property="og:type" content={data.type} />}
            {<meta property="og:url" content={window.location.href} />}
            {data?.meta_data?.title && data?.meta_data?.title.length > 0 && <meta property="og:title" content={data.title} />}
            {data?.meta_data?.description && data?.meta_data?.description.length > 0 && <meta property="og:description" content={data.description} />}
            {data?.title && data.title.length > 0 && <meta name="twitter:title" content={data?.title} />}
            {data?.description && data?.description.length > 0 && <meta name="twitter:description" content={data.description} />}
            </Helmet>
                <div className="flex max-w-[100%] min-h-full ">
                            <div className="duration-700 w-[100%]">
                                <div className="divide-y divide-gray-200   overflow-x-hidden bg-gray-500 overflow-auto rounded-sm shadow no-scrollbar" id="droparea">
                                    <div className="@container text-textColor bg-bg_color font-primary_font_family">
                                        <RSortable blocks={HomeJSON} staticData={staticData} />
                                    </div>
                                </div>
                            </div>
                </div>
            </>
        )
    }
    // !w-full !p-0 !m-0 !border-0 !static !shadow-none !transform-none !animate-none !bg-none !h-full !max-w-none
    