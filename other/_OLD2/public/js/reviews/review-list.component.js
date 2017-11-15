angular.module('foodApp').component('reviewList', {
	templateUrl: 'js/reviews/review-list.template.html',
	controller: function ReviewListController(){
		this.reviews = [
		{
			name: 'review1309',
			title: 'Custards Last Stand',
			date: '2013-09-01',
			description: 'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
			image: 'resto1.png'
		},
		{
			name: 'review1404',
			title: 'Grillenium Falcon',
			date: '2014-04-15',
			description: 'Pho (pronounced “fuh”) is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
			image: 'resto2.png'
		},
		{
			name: 'review1210',
			title: 'Lebaneser Scrooge',
			date: '2012-10-01',
			description: 'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor – with this authentic Mexican guacamole review, though, you will be an expert in no time.',
			image: 'resto3.png'
		},
		{
			name: 'review1810',
			title: 'Bread Zepplin',
			date: '2012-10-20',
			description: 'A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.',
			image: 'resto4.png'
		}
		]
	}
})








