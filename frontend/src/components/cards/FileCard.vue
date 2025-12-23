<template>
    <div class="card h-100 shadow-sm border-0 file-card">

        <div class="card-body d-flex flex-column">

            <!-- Header -->
            <div class="d-flex align-items-start gap-3 mb-3 w-100">

                <FileIcon :filename="file.filename" />

                <div class="flex-grow-1 min-w-0">

                    <div class="file-title line-clamp-2" :title="file.filename">
                        {{ file.filename }}
                    </div>

                    <small class="text-muted d-block">
                        Enviado em {{ formatDate(file.created_at) }}
                    </small>
                </div>


            </div>

            <!-- Actions -->
            <div class="mt-auto d-flex gap-2">
                <a :href="getFileUrl(file)" target="_blank" class="btn btn-sm btn-outline-primary w-100">
                    <i class="fa-solid fa-download me-1"></i>
                    Download
                </a>

                <button type="button" class="btn btn-sm btn-outline-danger" title="Remover anexo"
                    @click="removeFile(file.id)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import AbstractMixin from '@/mixins/AbstractMixin';
import FileIcon from '@/components/icons/FileIcon.vue';

export default {
    name: "FileCard",

    props: {
        file: {
            type: Object,
            required: true
        },
        removable: {
            type: Boolean,
            default: false
        }
    },

    components: { FileIcon },

    mixins: [AbstractMixin],

    computed: {
        extension() {
            return this.file.filename.split(".").pop().toLowerCase();
        },

        iconClass() {
            const map = {
                pdf: "fa-file-pdf text-danger",
                doc: "fa-file-word text-primary",
                docx: "fa-file-word text-primary",
                xls: "fa-file-excel text-success",
                xlsx: "fa-file-excel text-success",
                csv: "fa-file-csv text-success",
                jpg: "fa-file-image text-warning",
                jpeg: "fa-file-image text-warning",
                png: "fa-file-image text-warning",
                gif: "fa-file-image text-warning",
                mp4: "fa-file-video text-info",
                mov: "fa-file-video text-info",
                mp3: "fa-file-audio text-secondary",
                wav: "fa-file-audio text-secondary",
                zip: "fa-file-zipper text-dark",
                rar: "fa-file-zipper text-dark"
            };

            return map[this.extension] ?? "fa-file text-muted";
        },

        iconBgClass() {
            if (this.iconClass.includes("text-danger")) return "bg-danger-subtle";
            if (this.iconClass.includes("text-primary")) return "bg-primary-subtle";
            if (this.iconClass.includes("text-success")) return "bg-success-subtle";
            if (this.iconClass.includes("text-warning")) return "bg-warning-subtle";
            if (this.iconClass.includes("text-info")) return "bg-info-subtle";
            return "bg-secondary-subtle";
        },
    },

    methods: {
        getFileUrl(file) {
            return `${import.meta.env.VITE_BACKEND_FILES}/appointments/${file.storaged}`;
        },

        removeFile(fileId) {
            // confirmar + chamar API + atualizar lista
        }
    }
};
</script>

<style scoped>
.file-card {
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.file-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.file-title {
    font-weight: 600;
    line-height: 1.25;
    max-width: 100%;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    overflow: hidden;
    text-overflow: ellipsis;
}

@supports not (-webkit-line-clamp: 2) {
    .line-clamp-2 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
