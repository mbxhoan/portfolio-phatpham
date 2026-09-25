import type { Portfolio } from "@/types/portfolio";

/**
 * ============================================================
 *  EDIT YOUR ENTIRE SITE FROM THIS ONE FILE.
 *  Every page (public + admin) reads from here. No CMS required.
 *  Icons are chosen from the IconName union in src/types/portfolio.ts.
 * ============================================================
 */
export const portfolio: Portfolio = {
  person: {
    name: "Phạm Minh Phát",
    role: "Business",
    initials: "P",
    tagline:
      "Hơn 2 năm kinh nghiệm tư vấn và triển khai phần mềm cho doanh nghiệp. Chuyên sâu về hệ thống Quản lý kho (WMS), ERP, và tích hợp phần cứng (PDA, máy in công nghiệp). Tôi giúp biến các bài toán vận hành phức tạp thành phần mềm tinh gọn, hiệu quả.",
    email: "phamphat343@gmail.com",
    address: "District 1, Ho Chi Minh City, VN",
    yearsBadge: { value: "2+ năm", label: "BA · WMS · ERP" },
    quickLinks: {
      capability: { visible: true, label: "Năng lực chuyên môn", color: "#004AC6" },
      projects: { visible: true, label: "Dự án thực hiện", color: "#000B60" },
      contact: { visible: true, label: "Liên hệ ngay", color: "#475569" },
    },
  },

  // “Lĩnh vực hoạt động” on the home page
  fieldsTitle: "Lĩnh vực hoạt động",
  fieldsSubtitle: "Những bài toán vận hành mà tôi đã đồng hành cùng doanh nghiệp giải quyết bằng phần mềm.",
  fields: [
    {
      name: "Quản lý kho (WMS)",
      icon: "warehouse",
      visible: true,
      body: "Số hóa toàn bộ quy trình nhập – xuất – tồn, tích hợp PDA và máy in công nghiệp để vận hành kho chính xác theo thời gian thực.",
    },
    {
      name: "Quản lý sự kiện",
      icon: "calendar",
      visible: true,
      body: "Nền tảng quản lý sự kiện toàn diện, hỗ trợ từ khâu đăng ký, check-in đến báo cáo sau sự kiện. Đảm bảo quy trình vận hành nhanh chóng, chính xác và nâng cao trải nghiệm người tham dự.",
    },
    {
      name: "Giải pháp IoT",
      icon: "cpu",
      visible: true,
      body: "Triển khai các giải pháp IoT giúp kết nối thiết bị, thu thập và phân tích dữ liệu theo thời gian thực — tự động hóa quy trình và hỗ trợ ra quyết định chính xác.",
    },
  ],

  // “Năng lực chuyên môn”
  capabilities: [
    { name: "BPMN", icon: "workflow", body: "Nắm vững kiến thức về BPMN. Có khả năng mô hình hóa quy trình nghiệp vụ một cách trực quan, logic, giúp các bên liên quan dễ dàng hiểu và thống nhất luồng xử lý." },
    { name: "SQL", icon: "database", body: "Có kiến thức về SQL, có thể truy vấn dữ liệu, kiểm tra và hỗ trợ phân tích dữ liệu phục vụ cho việc làm rõ yêu cầu và kiểm thử hệ thống." },
    { name: "API", icon: "plug", body: "Hiểu và làm việc với API, có khả năng đọc tài liệu, test API (Postman), hỗ trợ tích hợp và trao đổi dữ liệu giữa các hệ thống." },
    { name: "Agile / Scrum", icon: "timer", body: "Có kinh nghiệm làm việc theo mô hình Agile/Scrum, tham gia grooming, sprint planning, daily meeting và phối hợp hiệu quả với team Dev, QA." },
    { name: "Phân tích yêu cầu", icon: "fileText", body: "Khai thác, phân tích và quản lý yêu cầu từ các bên liên quan; chuyển hóa nhu cầu nghiệp vụ thành đặc tả rõ ràng cho đội phát triển." },
    { name: "Wireframe / UX", icon: "layout", body: "Thiết kế wireframe và luồng người dùng, đảm bảo giải pháp vừa đáp ứng nghiệp vụ vừa mang lại trải nghiệm liền mạch." },
  ],

  // “Công cụ”
  tools: [
    { name: "Postman", icon: "plug", body: "Đọc tài liệu, test API, hỗ trợ tích hợp và trao đổi dữ liệu giữa các hệ thống." },
    { name: "Draw.io / Miro", icon: "penTool", body: "Mô hình hóa quy trình (BPMN, flowchart) trực quan, giúp các bên liên quan dễ hiểu và thống nhất nghiệp vụ." },
    { name: "Jira", icon: "boxes", body: "Quản lý task, theo dõi tiến độ dự án và phối hợp công việc theo mô hình Agile/Scrum." },
    { name: "Confluence", icon: "fileStack", body: "Tạo và quản lý tài liệu dự án, tập trung thông tin và chia sẻ kiến thức trong team." },
    { name: "Microsoft Office", icon: "presentation", body: "Excel, Word, PowerPoint để phân tích dữ liệu, viết tài liệu và trình bày báo cáo chuyên nghiệp." },
    { name: "Figma", icon: "figma", body: "Dựng wireframe và prototype để truyền đạt giải pháp tới các bên liên quan và đội phát triển." },
  ],

  // “Quy trình Hợp tác”
  processTitle: "Quy trình Hợp tác",
  processSubtitle: "Chúng tôi áp dụng mô hình vận hành chuyên nghiệp, đảm bảo tính minh bạch và hiệu quả cao nhất cho mọi sản phẩm công nghệ.",
  process: [
    { title: "Khám phá & Đánh giá", icon: "search", body: "Tìm hiểu ‘nỗi đau’ và quy trình kinh doanh hiện tại của bạn. Chúng tôi thực hiện khảo sát kỹ lưỡng để xác định mục tiêu chiến lược." },
    { title: "Thiết kế Giải pháp [BA Phase]", icon: "penTool", body: "Lên đặc tả hệ thống (BRD), thiết kế luồng dữ liệu, vẽ Wireframe và chốt yêu cầu. Xây dựng bản vẽ kiến trúc chi tiết trước khi đặt viên gạch đầu tiên." },
    { title: "Phát triển phần mềm", icon: "code", body: "Đội Dev tiến hành lập trình. Báo cáo tiến độ minh bạch theo từng giai đoạn, cho phép bạn theo dõi sản phẩm hình thành từng ngày." },
    { title: "UAT & Bàn giao", icon: "check", body: "Kiểm thử người dùng cuối, đào tạo sử dụng và bàn giao hệ thống hoàn chỉnh. Chúng tôi đồng hành cùng bạn đến khi hệ thống vận hành trơn tru." },
  ],

  categories: ["Tất cả", "WMS", "ERP", "IoT", "Sự kiện"],

  projectsTitle: "Dự án tiêu biểu",
  projectsSubtitle: "Các sản phẩm & hệ thống thực tế tôi đã tham gia phân tích, thiết kế và triển khai cho doanh nghiệp.",
  projects: [
    {
      slug: "wms-an-thien", logo: "AT", featured: true,
      title: "HỆ THỐNG QUẢN LÝ KHO DƯỢC PHẨM AN THIÊN",
      category: "WMS", year: "2024", role: "Business Analyst",
      summary: "Hệ thống quản lý kho thông minh An Thiên: quản lý vòng đời sản phẩm khép kín, tích hợp PDA & máy in mã vạch công nghiệp.",
      problem: "Kho dược phẩm vận hành thủ công, khó kiểm soát hạn dùng (lô/date) và truy vết, dễ sai lệch tồn kho.",
      solution: "Xây dựng WMS quản lý nhập–xuất–tồn theo lô/hạn dùng, quét mã bằng PDA, in tem tự động và đối soát tồn kho thời gian thực.",
      impact: ["Giảm 90% thời gian kiểm kê", "Truy vết lô/hạn dùng tức thời", "Sai lệch tồn kho < 0.5%"],
      tech: ["BRD", "BPMN", "PDA", "SQL", "REST API"],
    },
    {
      slug: "erp-tich-hop", logo: "ERP", featured: true,
      title: "TÍCH HỢP ERP & PHẦN CỨNG KHO VẬN",
      category: "ERP", year: "2024", role: "Business Analyst",
      summary: "Tích hợp ERP với hệ thống cân, máy in công nghiệp và PDA để đồng bộ dữ liệu vận hành end-to-end.",
      problem: "Dữ liệu rời rạc giữa ERP và thiết bị kho, nhập liệu trùng lặp và thiếu chính xác.",
      solution: "Thiết kế luồng tích hợp qua API/middleware, chuẩn hóa dữ liệu master và đồng bộ hai chiều theo thời gian thực.",
      impact: ["Loại bỏ nhập liệu trùng", "Đồng bộ real-time", "Rút ngắn 40% thời gian xử lý đơn"],
      tech: ["ERP", "API", "Middleware", "Agile"],
    },
    {
      slug: "iot-giam-sat", logo: "IoT", featured: true,
      title: "NỀN TẢNG GIÁM SÁT IOT",
      category: "IoT", year: "2025", role: "Business Analyst",
      summary: "Nền tảng IoT kết nối thiết bị, thu thập và phân tích dữ liệu theo thời gian thực phục vụ giám sát và cảnh báo.",
      problem: "Thiết bị hoạt động độc lập, không có dữ liệu tập trung để giám sát và ra quyết định.",
      solution: "Thu thập dữ liệu cảm biến qua gateway, trực quan hóa trên dashboard và cấu hình ngưỡng cảnh báo tự động.",
      impact: ["Giám sát tập trung 24/7", "Cảnh báo sự cố theo thời gian thực", "Báo cáo tự động"],
      tech: ["IoT", "MQTT", "Dashboard", "SQL"],
    },
    {
      slug: "quan-ly-su-kien", logo: "EVT", featured: false,
      title: "NỀN TẢNG QUẢN LÝ SỰ KIỆN",
      category: "Sự kiện", year: "2023", role: "Business Analyst",
      summary: "Quản lý sự kiện toàn diện từ đăng ký, check-in đến báo cáo sau sự kiện, nâng cao trải nghiệm người tham dự.",
      problem: "Quy trình đăng ký & check-in thủ công gây ùn tắc và thiếu dữ liệu sau sự kiện.",
      solution: "Số hóa đăng ký, check-in bằng QR và tổng hợp báo cáo realtime cho ban tổ chức.",
      impact: ["Check-in < 5 giây/khách", "Báo cáo sau sự kiện tức thì"],
      tech: ["QR", "BPMN", "Dashboard"],
    },
    {
      slug: "cong-no-erp", logo: "FIN", featured: false,
      title: "PHÂN HỆ CÔNG NỢ & THANH TOÁN",
      category: "ERP", year: "2023", role: "Business Analyst",
      summary: "Phân hệ quản lý công nợ phải thu/phải trả, đối soát và nhắc lịch thanh toán tự động.",
      problem: "Theo dõi công nợ trên Excel dễ sai sót và bỏ sót hạn thanh toán.",
      solution: "Chuẩn hóa quy trình công nợ, tự động đối soát và cảnh báo theo hạn.",
      impact: ["Giảm nợ quá hạn", "Đối soát tự động"],
      tech: ["ERP", "SQL", "BRD"],
    },
    {
      slug: "pda-picking", logo: "PDA", featured: false,
      title: "GIẢI PHÁP PICKING BẰNG PDA",
      category: "WMS", year: "2025", role: "Business Analyst",
      summary: "Tối ưu soạn hàng (picking) bằng PDA với lộ trình thông minh và kiểm tra sai sót tại nguồn.",
      problem: "Soạn hàng theo giấy chậm và nhiều lỗi nhặt sai.",
      solution: "Hướng dẫn picking trên PDA theo tuyến tối ưu, xác nhận bằng quét mã.",
      impact: ["Tăng năng suất picking 35%", "Giảm lỗi nhặt sai"],
      tech: ["PDA", "WMS", "API"],
    },
  ],

  socials: [
    { label: "Facebook", href: "#", icon: "messageSquare" },
    { label: "Zalo", href: "#", icon: "messageSquare" },
    { label: "YouTube", href: "#", icon: "messageSquare" },
    { label: "Mail", href: "mailto:phamphat343@gmail.com", icon: "fileText" },
  ],

  // ---- admin-only demo content ----
  messages: [
    { id: 1, name: "Trần Quốc Bảo", email: "bao.tran@anthien.vn", subject: "Tư vấn hệ thống WMS", preview: "Bên mình muốn số hóa kho dược, cần trao đổi thêm về tích hợp PDA...", time: "10 phút trước", status: "new" },
    { id: 2, name: "Nguyễn Thị Hà", email: "ha.nguyen@eventpro.vn", subject: "Báo giá nền tảng sự kiện", preview: "Sự kiện ~2000 khách, cần check-in QR và báo cáo realtime.", time: "1 giờ trước", status: "new" },
    { id: 3, name: "Lê Minh Tuấn", email: "tuan.le@iotlab.io", subject: "Hợp tác giải pháp IoT", preview: "Đang tìm BA cho dự án giám sát thiết bị nhà máy.", time: "Hôm qua", status: "read" },
    { id: 4, name: "Phạm Anh Khoa", email: "khoa.pham@logix.vn", subject: "Tối ưu picking bằng PDA", preview: "Kho 5000 SKU, lỗi nhặt sai cao, cần tư vấn quy trình.", time: "2 ngày trước", status: "read" },
  ],

  stats: [
    { label: "Lượt xem hồ sơ", value: "3.482", sub: "12% so với tuần trước", icon: "eye" },
    { label: "Tin nhắn", value: "24", sub: "8 Chưa đọc · cần phản hồi", icon: "messageSquare" },
    { label: "Lượt tương tác", value: "15.650", sub: "98% KPI · hiệu suất tổng thể", icon: "trendingUp" },
  ],
  footerSocials: {
    facebook: { visible: true, url: "#" },
    instagram: { visible: true, url: "#" },
    youtube: { visible: true, url: "#" },
  },
};

export default portfolio;
