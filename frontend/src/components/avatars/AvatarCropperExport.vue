<template>
	<div class="cropper-container">
		<AvatarCropper
			ref="cropper"
			:src="src"
			:size="size"
			:zoom="zoom"
			@update:position="updatePosition"
		/>

		<button class="save-btn" @click="exportCrop">
			Salvar recorte
		</button>
	</div>
</template>

<script>
import AvatarCropper from "./AvatarCropper.vue";

export default {
	name: "AvatarCropperExport",

	components: { AvatarCropper },

	props: {
		src: { type: String, required: true },
		size: { type: Number, default: 200 },
		zoom: { type: Number, default: 1.4 },

		// Export options
		output: {
			type: String,
			default: "blob", // blob | base64
		},
	},

	data() {
		return {
			pos: { x: 0, y: 0 },
			natural: { width: 0, height: 0 },
		};
	},

	methods: {
		updatePosition(pos) {
			this.pos = pos;
		},

		async exportCrop() {
			const cropper = this.$refs.cropper;

			const wrapper = cropper.$refs.wrapper;
			const img = cropper.$refs.image;

			const circleSize = this.size;

			// Posição final da imagem arrastada
			const offsetX = this.pos.x;
			const offsetY = this.pos.y;

			// Tamanho final da imagem renderizada com zoom
			const renderWidth = img.offsetWidth;
			const renderHeight = img.offsetHeight;

			// Criar canvas quadrado
			const canvas = document.createElement("canvas");
			canvas.width = circleSize;
			canvas.height = circleSize;

			const ctx = canvas.getContext("2d");

			// 🔥 Criar máscara circular
			ctx.beginPath();
			ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

			// 🔥 Desenhar imagem aplicando o deslocamento exato
			// OBS: img.top-left é sempre 0,0 (absolute)
			ctx.drawImage(
				img,
				offsetX,
				offsetY,
				renderWidth,
				renderHeight
			);

			if (this.output === "base64") {
				const dataURL = canvas.toDataURL("image/png");
				this.$emit("export", { base64: dataURL });
			} else {
				const blob = await new Promise((resolve) =>
					canvas.toBlob(resolve, "image/png")
				);
				this.$emit("export", { blob });
			}
		},
	},
};
</script>

<style scoped>
.cropper-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

.save-btn {
	background: #007bff;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 6px;
	cursor: pointer;
}
</style>
