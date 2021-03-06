<form role="form" class="glossary-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<div class="checkbox">
				<label for="enabled" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="enabled" name="enabled">
					<span class="mdl-switch__label"><strong>Enabled</strong></span>
				</label>
			</div>
			<div class="checkbox">
				<label for="singleMatch" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="singleMatch" name="singleMatch">
					<span class="mdl-switch__label"><strong>Single Match</strong></span>
				</label>
			</div>
			<div class="checkbox">
				<label for="caseSensitive" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="caseSensitive" name="caseSensitive">
					<span class="mdl-switch__label"><strong>Case Sensitive</strong></span>
				</label>
			</div>
			<div class="form-group">
				<label for="icon">
					Icon to show next to keyword, leave empty to disable
				</label>
				<input class="form-control"  type="text" name="icon" id="icon">
			</div>
		</div>
	</div>

	<br />

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Keywords</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<button id="upload-csv" class="btn btn-default">Upload CSV</button>
				<button id="empty-glossary" class="btn btn-danger">Delete All</button>
			</div>
			<div class="form-group" data-type="sorted-list" data-sorted-list="keywords" data-item-template="admin/plugins/glossary/partials/sorted-list/item" data-form-template="admin/plugins/glossary/partials/sorted-list/form">
				<ul data-type="list" class="list-group"></ul>
				<button type="button" data-type="add" class="btn btn-info">Add Item</button>
			</div>
		</div>
	</div>

	<br />
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
