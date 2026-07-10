import React, { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#08070d] text-[#ece9ff]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};

export default RootLayout;
