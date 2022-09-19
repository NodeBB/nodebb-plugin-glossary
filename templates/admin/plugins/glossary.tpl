<form role="form" class="glossary-settings">
	<div class="row mb-4">
		<div class="col-sm-2 col-12 settings-header">General</div>
		<div class="col-sm-10 col-12">
			<div class="checkbox mb-3">
				<label for="enabled" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="enabled" name="enabled">
					<span class="mdl-switch__label"><strong>Enabled</strong></span>
				</label>
			</div>
			<div class="checkbox mb-3">
				<label for="singleMatch" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="singleMatch" name="singleMatch">
					<span class="mdl-switch__label"><strong>Single Match</strong></span>
				</label>
			</div>
			<div class="checkbox mb-3">
				<label for="caseSensitive" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="caseSensitive" name="caseSensitive">
					<span class="mdl-switch__label"><strong>Case Sensitive</strong></span>
				</label>
			</div>
			<div>
				<label class="form-label" for="icon">
					Icon to show next to keyword, leave empty to disable
				</label>
				<input class="form-control"  type="text" name="icon" id="icon">
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-2 col-12 settings-header">Keywords</div>
		<div class="col-sm-10 col-12">
			<div class="mb-3">
				<button id="upload-csv" class="btn btn-default">Upload CSV</button>
				<button id="empty-glossary" class="btn btn-danger">Delete All</button>
			</div>
			<div data-type="sorted-list" data-sorted-list="keywords" data-item-template="admin/plugins/glossary/partials/sorted-list/item" data-form-template="admin/plugins/glossary/partials/sorted-list/form">
				<ul data-type="list" class="list-group mb-2"></ul>
				<button type="button" data-type="add" class="btn btn-info">Add Item</button>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
