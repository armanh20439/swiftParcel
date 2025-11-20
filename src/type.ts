export interface AllItemWork {
    title: string;
    description: string;
}
export interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
export interface ServiceCardProps {
  service: Service;
}
