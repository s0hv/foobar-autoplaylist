<template>
  <div class="how-to-use">
    <h3>How to use</h3>
    <details>
      <summary>Importing a query</summary>
      <ol>
        <li>
          You can import an existing query by pasting it in the <a href="#import-query">import query</a> textbox
          and then clicking on import query.
        </li>
        <li>
          After a successful import the imported query will be reformatted under the "Generate query" button.
        </li>
        <li>
          In case the generated query differs from the original or an error occurs during
          import when it should not, create an issue on the
          <a href="https://github.com/s0hv/foobar-autoplaylist/issues" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
        </li>
      </ol>
    </details>

    <details>
      <summary>Creating a new query</summary>
      <ol>
        <li>
          Start by selecting the appropriate query type and then clicking <a href="#add-query-btn">add new query</a>.
          The type of query you'll most likely want to start with is metadata query.
          "Query types" has more information on each type of query.
        </li>
        <li>
          Modify the wanted query until it's what you want. Refer to "Query types" on what each input does.
        </li>
        <li>
          Queries can be reordered by dragging them with the drag icon <v-icon class="handle">drag_handle</v-icon>.
          When using nested queries, queries can be dragged in and out of the gray boxes representing the nested query.
        </li>
        <li>
          Queries can be deleted by clicking on the trash can icon <v-icon style="cursor: pointer">delete_forever</v-icon>.
          Deleting a nested query will delete everything inside it as well.
        </li>
      </ol>
    </details>
    <details>
      <summary>Query types</summary>
      <details>
        <summary>General information on queries</summary>
        <ul>
          <li>
            Most fields have suggested values but will accept any arbitrary value
            unless otherwise specified.
          </li>
          <li>
            Each query has a NOT checkbox that will invert the result of the query if checked.
          </li>
          <li>
            Queries can be combined with either AND or OR logical operators.
            The input containing these options will show up when more than one query is used.
          </li>
        </ul>
      </details>
      <details>
        <summary>Metadata query</summary>
        <span>
          This type of query is used for text comparisons. The first field should
          be a metadata field (e.g. %artist%) or a function. The operator list
          contains operators that can be used for comparing two strings.
          The last input is the value the the first input is compared to.
          This can be any arbitrary value, metadata field or function.
        </span>
      </details>
      <details>
        <summary>Time query</summary>
        <span>
          This type of query is used for date comparisons. The first field
          should be a metadata field or a function that returns a date.
          The second field contains the operator used to compare two dates.
          The last field is for a date input which only accepts values in the format
          YYYY-MM-DD hh:mm:ss. The accuracy can be changed with the slider below.
        </span>
      </details>
      <details>
        <summary>Free editing space</summary>
        <span>
          You can write anything here in case some functionality is not possible
          to do using the existing queries.
        </span>
      </details>
      <details>
        <summary>Combine multiple queries</summary>
        <span>
          This query does not have any inputs in it but you can drag other queries inside it.
          This query is the functional equivalent of brackets.
        </span>
      </details>
    </details>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class HowToUse extends Vue {
}
</script>

<style scoped>
.how-to-use {
  padding-bottom: 2em;
  width: 40%;
}
.how-to-use details {
  text-align: left;
}

details > details, details span {
  padding-left: 2em;
  white-space: pre-line;
}

details span {
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

details ol, details ul {
  padding-left: 3em !important;
}
</style>
