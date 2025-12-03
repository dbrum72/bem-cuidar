<template>
    <div ref="wrapper" class="cropper-wrapper" :style="{ width: size + 'px', height: size + 'px' }"
        @mousedown="startDrag" @touchstart="startDrag">
        <img ref="image" :src="src" class="cropper-image" @load="setupImage" draggable="false" :style="{
            transform: `translate(${pos.x}px, ${pos.y}px)`
        }" />
    </div>
</template>

<script>
export default {
    props: {
        src: { type: String, required: true },
        size: { type: Number, default: 200 },
        zoom: { type: Number, default: 1.4 }
    },

    data() {
        return {
            pos: { x: 0, y: 0 },
            start: { x: 0, y: 0 },
            dragging: false,
            limits: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
        };
    },

    methods: {
        setupImage() {
            const wrapper = this.$refs.wrapper;
            const img = this.$refs.image;

            const W = wrapper.offsetWidth;
            const H = wrapper.offsetHeight;

            // 🔥 AQUI O ZOOM É REAL E GARANTIDO
            img.style.width = W * this.zoom + "px";
            img.style.height = H * this.zoom + "px";

            this.$nextTick(() => {
                const iW = img.offsetWidth;
                const iH = img.offsetHeight;

                // 🔥 Limites reais baseado no DOM
                this.limits.minX = -(iW - W);
                this.limits.maxX = 0;

                this.limits.minY = -(iH - H);
                this.limits.maxY = 0;

                // Centraliza no início
                this.pos.x = this.limits.minX / 2;
                this.pos.y = this.limits.minY / 2;

                console.log("zoom aplicado:", W * this.zoom, H * this.zoom);
                console.log("limits:", this.limits);
            });
        },

        getPoint(e) {
            return e.touches
                ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : { x: e.clientX, y: e.clientY };
        },

        startDrag(e) {
            this.dragging = true;
            const p = this.getPoint(e);
            this.start.x = p.x - this.pos.x;
            this.start.y = p.y - this.pos.y;

            document.addEventListener("mousemove", this.onDrag);
            document.addEventListener("mouseup", this.stopDrag);
            document.addEventListener("touchmove", this.onDrag, { passive: false });
            document.addEventListener("touchend", this.stopDrag);
        },

        onDrag(e) {
            if (!this.dragging) return;

            const p = this.getPoint(e);

            let newX = p.x - this.start.x;
            let newY = p.y - this.start.y;

            // 🔥 Limites realmente aplicados
            newX = Math.max(this.limits.minX, Math.min(this.limits.maxX, newX));
            newY = Math.max(this.limits.minY, Math.min(this.limits.maxY, newY));

            this.pos.x = newX;
            this.pos.y = newY;
        },

        stopDrag() {
            this.dragging = false;
            document.removeEventListener("mousemove", this.onDrag);
            document.removeEventListener("mouseup", this.stopDrag);
            document.removeEventListener("touchmove", this.onDrag);
            document.removeEventListener("touchend", this.stopDrag);

            this.$emit("update:position", { ...this.pos });
        }
    }
};
</script>

<style scoped>
.cropper-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    cursor: grab;
    user-select: none;
}

.cropper-image {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;

    /* 🔥 OBRIGATÓRIO: NÃO DEFINIR WIDTH/HEIGHT AQUI! */
    /* O TAMANHO VEM 100% DO JS */
}
</style>
