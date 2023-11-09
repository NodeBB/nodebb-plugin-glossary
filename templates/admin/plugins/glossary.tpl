<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="glossary-settings">
				<div id="general" class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">General</h5>
					<div class="mb-4">
						<div class="form-check form-switch mb-3">
							<input class="form-check-input" id="enabled" type="checkbox" name="enabled" />
							<label class="form-check-label" for="enabled">Enabled</label>
						</div>

						<div class="form-check form-switch mb-3">
							<input class="form-check-input" id="singleMatch" type="checkbox" name="singleMatch" />
							<label class="form-check-label" for="singleMatch">Single Match</label>
						</div>

						<div class="form-check form-switch mb-3">
							<input class="form-check-input" id="caseSensitive" type="checkbox" name="caseSensitive" />
							<label class="form-check-label" for="caseSensitive">Case Sensitive</label>
						</div>

						<div>
							<label class="form-label" for="icon">
								Icon to show next to keyword, leave empty to disable
							</label>
							<input class="form-control" type="text" name="icon" id="icon">
						</div>
					</div>
				</div>

				<hr/>

				<div id="keywords">
					<h5 class="fw-bold tracking-tight settings-header">Keywords</h5>
					<div>
						<div class="mb-3">
							<button id="upload-csv" class="btn btn-light btn-sm">Upload CSV</button>
							<button id="empty-glossary" class="btn btn-danger btn-sm">Delete All</button>
						</div>
						<div data-type="sorted-list" data-sorted-list="keywords" data-item-template="admin/plugins/glossary/partials/sorted-list/item" data-form-template="admin/plugins/glossary/partials/sorted-list/form">
							<ul data-type="list" class="list-group mb-2"></ul>
							<button type="button" data-type="add" class="btn btn-primary btn-sm">Add Item</button>
						</div>
					</div>
				</div>
			</form>
		</div>

		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>





