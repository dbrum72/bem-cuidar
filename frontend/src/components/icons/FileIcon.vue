<template>
    <i class="bi file-icon" :class="[iconClass, bgClass]" aria-hidden="true"></i>
</template>

<script>
export default {
    name: "FileIcon",

    props: {
        filename: {
            type: String,
            required: true
        }
    },

    computed: {
        extension() {
            return this.filename.split(".").pop().toLowerCase();
        },

        iconClass() {
            const map = {
                pdf: "bi-file-earmark-pdf-fill",
                doc: "bi-file-earmark-word-fill",
                docx: "bi-file-earmark-word-fill",
                xls: "bi-file-earmark-excel-fill",
                xlsx: "bi-file-earmark-excel-fill",
                csv: "bi-file-earmark-spreadsheet-fill",
                jpg: "bi-file-earmark-image-fill",
                jpeg: "bi-file-earmark-image-fill",
                png: "bi-file-earmark-image-fill",
                gif: "bi-file-earmark-image-fill",
                mp4: "bi-file-earmark-play-fill",
                mov: "bi-file-earmark-play-fill",
                mp3: "bi-file-earmark-music-fill",
                wav: "bi-file-earmark-music-fill",
                zip: "bi-file-earmark-zip-fill",
                rar: "bi-file-earmark-zip-fill"
            };

            return map[this.extension] ?? "bi-file-earmark-fill";
        },

        bgClass() {
            const colorMap = {
                pdf: "bg-danger-subtle text-danger",
                doc: "bg-primary-subtle text-primary",
                docx: "bg-primary-subtle text-primary",
                xls: "bg-success-subtle text-success",
                xlsx: "bg-success-subtle text-success",
                jpg: "bg-warning-subtle text-warning",
                png: "bg-warning-subtle text-warning",
                mp4: "bg-info-subtle text-info"
            };

            return colorMap[this.extension] ?? "bg-secondary-subtle text-secondary";
        }
    }
};
</script>

<style scoped>

.file-icon {
    font-size: 1.35rem;
    line-height: 1;
    background-color: transparent !important;
}
</style>
