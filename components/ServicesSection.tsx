const services = [
  {
    id: "tours",
    icon: "🗺️",
    title: "Tour Trọn Gói",
    description:
      "Các gói tour được thiết kế chi tiết, bao gồm vận chuyển, lưu trú và hướng dẫn viên chuyên nghiệp.",
  },
  {
    id: "hotels",
    icon: "🏨",
    title: "Đặt Phòng Khách Sạn",
    description:
      "Hệ thống khách sạn 3–5 sao được kiểm duyệt kỹ lưỡng với giá tốt nhất thị trường.",
  },
  {
    id: "flights",
    icon: "✈️",
    title: "Đặt Vé Máy Bay",
    description:
      "So sánh và đặt vé máy bay giá rẻ từ hàng trăm hãng hàng không trong và ngoài nước.",
  },
  {
    id: "guide",
    icon: "👨‍💼",
    title: "Hướng Dẫn Viên",
    description:
      "Đội ngũ hướng dẫn viên giàu kinh nghiệm, am hiểu văn hóa địa phương.",
  },
];

export default function ServicesSection() {
  return (
    <section
      data-testid="services-section"
      id="services"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ du lịch để mang lại trải
            nghiệm hoàn hảo cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              data-testid={`service-card-${service.id}`}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow duration-200"
            >
              <span className="text-5xl mb-4" aria-hidden="true">
                {service.icon}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
