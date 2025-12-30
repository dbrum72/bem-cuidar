export default {
	namespaced: true,

	actions: {
		async exec(
			{ dispatch },
			{ callFn, successMsg = null, errorMsg = null, swallow = true }
		) {
			try {
				const response = await callFn();

				let message = null;

				if (typeof successMsg === "function") {
					message = successMsg(response);
				} else {
					message = successMsg;
				}

				if (message) {
					dispatch(
						"alerts/show",
						{
							type: "success",
							message,
							icon: {
								name: "bi bi-check-circle",
								color: "green",
							},
						},
						{ root: true }
					);
				}

				return response;
			} catch (error) {
				if (
					errorMsg &&
					error?.response?.status &&
					error.response.status < 500
				) {
					dispatch(
						"alerts/show",
						{
							type: "danger",
							message: errorMsg,
							icon: {
								name: "bi bi-exclamation-triangle",
								color: "red",
							},
						},
						{ root: true }
					);
				}

				if (!swallow) throw error;

				return null;
			}
		},
	},
};
