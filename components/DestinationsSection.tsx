import Link from "next/link";

const destinations = [
  {
    id: "ha-long",
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh",
    description:
      "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi hùng vĩ và hang động kỳ ảo.",
    price: "2.500.000₫",
    duration: "3 ngày 2 đêm",
    bg: "from-cyan-400 to-blue-600",
    emoji: "🏝️",
  },
  {
    id: "hoi-an",
    name: "Phố Cổ Hội An",
    location: "Quảng Nam",
    description:
      "Thành phố cổ quyến rũ với những ngôi nhà cổ, đèn lồng đầy màu sắc và ẩm thực phong phú.",
    price: "1.800.000₫",
    duration: "2 ngày 1 đêm",
    bg: "from-yellow-400 to-orange-500",
    emoji: "🏮",
  },
  {
    id: "sapa",
    name: "Sa Pa",
    location: "Lào Cai",
    description:
      "Vùng núi non hùng vĩ với ruộng bậc thang tuyệt đẹp và văn hóa dân tộc độc đáo.",
    price: "3.200.000₫",
    duration: "3 ngày 2 đêm",
    bg: "from-green-400 to-teal-600",
    emoji: "⛰️",
  },
  {
    id: "phu-quoc",
    name: "Đảo Phú Quốc",
    location: "Kiên Giang",
    description:
      "Hòn đảo ngọc với bãi biển trong xanh, rừng nguyên sinh và ẩm thực hải sản tươi ngon.",
    price: "4.500.000₫",
    duration: "4 ngày 3 đêm",
    bg: "from-blue-400 to-indigo-600",
    emoji: "🌊",
  },
];

export default function DestinationsSection() {
  return (
    <section
      data-testid="destinations-section"
      id="destinations"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Điểm Đến Nổi Bật
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Khám phá những điểm đến hấp dẫn nhất Việt Nam được yêu thích bởi
            hàng nghìn du khách.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              data-testid={`destination-card-${dest.id}`}
              className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition-shadow duration-200 flex flex-col"
            >
              {/* Card image placeholder */}
              <div
                className={`bg-gradient-to-br ${dest.bg} h-40 flex items-center justify-center`}
                aria-hidden="true"
              >
                <span className="text-6xl">{dest.emoji}</span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {dest.name}
                  </h3>
                </div>
                <p className="text-xs text-blue-600 font-medium mb-2">
                  📍 {dest.location}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                  {dest.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-auto">
                  <span className="font-bold text-blue-700">{dest.price}</span>
                  <span className="text-gray-400">{dest.duration}</span>
                </div>
                <Link
                  href="/booking"
                  className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  data-testid={`book-${dest.id}`}
                >
                  Đặt ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
