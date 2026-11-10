import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h1>Welcome Home!</h1>
			<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, sit maiores provident velit officiis blanditiis sapiente. Perspiciatis, saepe ea tenetur, nesciunt enim eum vitae corrupti fuga iusto odit, accusantium dolores?</p>

			<section>
				<h2>Lorem, ipsum dolor.</h2>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet repellat dolorum fugiat saepe alias voluptatum odit repudiandae, ullam quia, quos provident asperiores doloremque, quod ipsum expedita rerum quae temporibus adipisci?
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque aliquam voluptate architecto tempore officia dignissimos dolores atque cumque dolor voluptatum qui, molestiae nobis odio error, praesentium nesciunt animi ea voluptates.
				</p>

				<section>
				<h3>Lorem, ipsum dolor.</h3>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet repellat dolorum fugiat saepe alias voluptatum odit repudiandae, ullam quia, quos provident asperiores doloremque, quod ipsum expedita rerum quae temporibus adipisci?
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque aliquam voluptate architecto tempore officia dignissimos dolores atque cumque dolor voluptatum qui, molestiae nobis odio error, praesentium nesciunt animi ea voluptates.
				</p>
			</section>
			<section>
				<h3>Lorem, ipsum dolor.</h3>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet repellat dolorum fugiat saepe alias voluptatum odit repudiandae, ullam quia, quos provident asperiores doloremque, quod ipsum expedita rerum quae temporibus adipisci?
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque aliquam voluptate architecto tempore officia dignissimos dolores atque cumque dolor voluptatum qui, molestiae nobis odio error, praesentium nesciunt animi ea voluptates.
				</p>
			</section>
			</section>
		</div>
	);
}
