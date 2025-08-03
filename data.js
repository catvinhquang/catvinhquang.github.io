// Dummy data for the application

const restaurants = [
    {
        id: 1,
        name: "Bánh Mì Huynh Hoa",
        description: "Huynh Hoa - vị bánh mì Sài Gòn",
        distance: "2km",
        rating: 4.8,
        discount: 10,
        freeship: true,
        image: "https://images.pexels.com/photos/1603898/pexels-photo-1603898.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Bánh",
        collection: "phuong-cho-quan",
        location: { lat: 10.7769, lng: 106.7009 },
        menu: [
            { name: "Bánh mì thịt", price: "35.000đ" },
            { name: "Bánh mì chả", price: "30.000đ" },
            { name: "Bánh mì pate", price: "25.000đ" },
            { name: "Bánh mì xíu mại", price: "35.000đ" }
        ]
    },
    {
        id: 2,
        name: "Cơm Tấm Ba Ghiền",
        description: "Cơm tấm sườn bì chả - ăn là ghiền",
        distance: "2km",
        rating: 4.8,
        discount: 20,
        freeship: true,
        image: "https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Cơm",
        collection: "phuong-cho-quan",
        location: { lat: 10.7789, lng: 106.6989 },
        menu: [
            { name: "Cơm tấm sườn bì chả", price: "45.000đ" },
            { name: "Cơm tấm sườn", price: "40.000đ" },
            { name: "Cơm tấm sườn bì", price: "43.000đ" },
            { name: "Cơm tấm sườn chả", price: "43.000đ" }
        ]
    },
    {
        id: 3,
        name: "Gà Nướng Sốt - Bà Dung",
        description: "Gà nướng vàng ruộm, sốt cay đậm",
        distance: "2km",
        rating: 4.5,
        discount: 16,
        freeship: true,
        image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Gà",
        collection: "phuong-cho-quan",
        location: { lat: 10.7749, lng: 106.7029 },
        menu: [
            { name: "Gà nướng nguyên con", price: "180.000đ" },
            { name: "Cánh gà nướng", price: "60.000đ" },
            { name: "Đùi gà nướng", price: "70.000đ" },
            { name: "Combo gà nướng", price: "120.000đ" }
        ]
    },
    {
        id: 4,
        name: "Gỏi Cuốn Cô Hồng",
        description: "Bích Phong - gỏi cuốn ngon tròn vị",
        distance: "2km",
        rating: 4.8,
        discount: 20,
        freeship: true,
        image: "https://images.pexels.com/photos/3147493/pexels-photo-3147493.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Gỏi",
        collection: "phuong-cho-quan",
        location: { lat: 10.7729, lng: 106.6969 },
        menu: [
            { name: "Gỏi cuốn tôm thịt", price: "35.000đ" },
            { name: "Gỏi cuốn chay", price: "25.000đ" },
            { name: "Gỏi cuốn đặc biệt", price: "45.000đ" },
            { name: "Combo gỏi cuốn", price: "80.000đ" }
        ]
    },
    {
        id: 5,
        name: "Bánh Xèo Rau Rừng Cô Nguyệt",
        description: "Đậm đà hương vị quê nhà",
        distance: "2km",
        rating: 4.8,
        discount: 10,
        freeship: true,
        image: "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Bánh",
        collection: "phuong-cho-quan",
        location: { lat: 10.7809, lng: 106.7049 },
        menu: [
            { name: "Bánh xèo nhân tôm", price: "40.000đ" },
            { name: "Bánh xèo nhân thịt", price: "35.000đ" },
            { name: "Bánh xèo chay", price: "30.000đ" },
            { name: "Combo bánh xèo", price: "70.000đ" }
        ]
    },
    {
        id: 6,
        name: "Phở Bò Hà Nội",
        description: "Phở bò truyền thống, nước dùng đậm đà",
        distance: "3km",
        rating: 4.7,
        discount: 15,
        freeship: false,
        image: "https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Phở",
        collection: "phuong-cau-lanh-ong",
        location: { lat: 10.7689, lng: 106.6929 }
    },
    {
        id: 7,
        name: "Bún Riêu Cua Đồng",
        description: "Bún riêu cua đồng, đậm vị miền Bắc",
        distance: "2.5km",
        rating: 4.6,
        discount: 20,
        freeship: true,
        image: "https://images.pexels.com/photos/3764353/pexels-photo-3764353.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Bún",
        collection: "phuong-nhieu-loc",
        location: { lat: 10.7849, lng: 106.6869 }
    },
    {
        id: 8,
        name: "Mì Ý Pepperoni",
        description: "Mì Ý sốt cà chua, phô mai béo ngậy",
        distance: "1.5km",
        rating: 4.9,
        discount: 25,
        freeship: true,
        image: "https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        category: "Mì Ý",
        collection: "phuong-khanh-hoi-4",
        location: { lat: 10.7709, lng: 106.7089 }
    }
];

const ocopProducts = [
    {
        id: 1,
        name: "Nước Yến Sào và Đông Trùng Hạ Thảo",
        description: "Yến sào, đông trùng hạ thảo là sản phẩm tự nhiên nhiều.",
        image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Rượu Sâm Đình Lãng",
        description: "Đình lãng được trồng phổ biến ở nước ta. Có thể dùng là hoặc rễ đình lãng để làm thuốc.",
        image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Nước Ép Tỏi Đen Mộc Đan",
        description: "Thành phần Tỏi Đen 100% tự nhiên, Nước Tỏi Đen Mộc Đan chứa nguồn lớn chất dinh dưỡng.",
        image: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Cà Phê Hoa Tan Trái Cây",
        description: "Cà phê hoa tan trái cây là dòng sản phẩm cà phê hoa tan kết hợp hương vị trái cây độc đáo.",
        image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Mật Dừa Nước Hữu Cơ",
        description: "Mật dừa nước là thức uống dinh dưỡng được làm từ nước dừa tươi 100% tự nhiên.",
        image: "https://images.pexels.com/photos/1268558/pexels-photo-1268558.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
    }
];

const promotions = {
    mb: [
        {
            id: 1,
            title: "💳 Phiếu giảm giá 50K từ MB Bank",
            description: "Dành cho khách hàng mới của MB Bank khi thanh toán đơn hàng ShopeeFood. Áp dụng cho đơn từ 100K",
            image: "https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        },
        {
            id: 2,
            title: "🎁 Ưu đãi khủng - Giảm ngay 200K",
            description: "Dành riêng cho chủ thẻ MB Bank liên kết ShopeeFood. Số lượng có hạn mỗi ngày!",
            image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        },
        {
            id: 3,
            title: "💵 Giảm 50% cho mọi đơn hàng ShopeeFood",
            description: "Thường thức món ngon, thanh toán nhẹ tênh cùng MB Bank! Tối đa giảm 50K - Áp dụng mỗi tuần",
            image: "https://images.pexels.com/photos/5650023/pexels-photo-5650023.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        }
    ],
    vietcoco: [
        {
            id: 4,
            title: "🥥 Tặng nước dừa khi đặt hàng trên ShopeeFood",
            description: "Sảng khoái miễn phí - đơn hàng bất kỳ có sản phẩm Vietcoco. Áp dụng đồng thời với các khuyến mãi ShopeeFood",
            image: "https://images.pexels.com/photos/1030870/pexels-photo-1030870.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        }
    ]
};

// Export data for use in script.js
window.appData = {
    restaurants,
    ocopProducts,
    promotions
};