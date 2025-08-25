import TemplateRestaurant from "@/components/templates/TemplateRestaurant";

export const metadata = {
  title: "Restaurant Template | Mark's Portfolio",
  description: 'A modern restaurant website template, designed to showcase your menu and encourage reservations.'
};

export default function RestaurantTemplatePage() {
  return <TemplateRestaurant variant="home" />;
}
