<h2>[[glossary:title]]</h2>
<ul class="list-group">
{{{ each keywords }}}
<li class="list-group-item">
<a href="{./url}">{./name}</a>
<p class="help-block">{./description}</p>
</li>
{{{ end }}}
</ul>

<!-- IMPORT partials/paginator.tpl -->