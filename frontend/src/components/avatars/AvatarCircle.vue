<template>
	<div
		class="avatar-circle"
		:style="{
			'--size': size,
			'--border': border,
			backgroundImage: src ? `url(${src})` : 'none',
		}"
		:class="{ 'avatar-placeholder': !src }"
	></div>
</template>

<script>
export default {
	name: "AvatarCircle",

	props: {
		src: {
			type: String,
			default: null,
		},
		size: {
			type: String,
			default: "120px", // ex: "80px", "10rem", "20vw"
		},
		border: {
			type: String,
			default: "3px solid #fff",
		},
	},
};
</script>

<style scoped>
.avatar-circle {
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	border: var(--border);
	background-size: cover;
	background-position: center;
	background-color: #ddd;
	display: inline-block;
	overflow: hidden;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

/* Se não houver imagem */
.avatar-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: calc(var(--size) / 3.5);
	font-weight: bold;
	color: #666;
	background-color: #f1f1f1;
}
</style>
