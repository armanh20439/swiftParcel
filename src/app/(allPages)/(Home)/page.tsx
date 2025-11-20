
import Banner from "@/components/Home/Banner/Banner";
import BeMerchant from "@/components/Home/BeMarchent/BeMarchent";
import ClientLogosMarquee from "@/components/Home/ClientLogosMarquee/ClientLogosMarquee";
import CustomerReviews from "@/components/Home/CustomerReviews/CustomerReviews";
import FAQSection from "@/components/Home/FAQSection/FAQSection";
import Features from "@/components/Home/Features/Features";
import Services from "@/components/Home/Services/Services";
import AllworkSteps from "@/components/Shared/AllWorkSteps/AllworkSteps";



export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <AllworkSteps></AllworkSteps>
      <Services></Services>
      <ClientLogosMarquee></ClientLogosMarquee>
      <Features></Features>
      <BeMerchant></BeMerchant>
      <CustomerReviews></CustomerReviews>
      <FAQSection></FAQSection>
    </div>
  );
}
