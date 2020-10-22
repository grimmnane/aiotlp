Component({
	data: {
		active: 0,
		list: [
			{
				icon: 'home-o',
				text: '首页',
				url: '/pages/index/index'
			},
			{
				icon: 'apps-o',
				text: '生产管理',
				url: '/pages/manage/index'
			},
			{
				icon: 'chat-o',
				text: '消息',
				url: '/pages/message/index'
			},
			{
				icon: 'contact',
				text: '我',
				url: '/pages/mine/index'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
